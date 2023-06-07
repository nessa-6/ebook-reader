from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Book, Translation, Chapter
from .serializers import BookSerializer, TranslationSerializer
from googletrans import Translator
from django.http import JsonResponse
import re
import spacy
import json
from .epub import send_to_db

# Create your views here.

@api_view(['GET']) # decorator
def getRoutes(request):
    routes = [
        {
            'Endpoint': '/library/',
            'method': 'GET',
            'body': None,
            'description': 'Returns an array of books'
        },
        {
            'Endpoint': '/library/id',
            'method': 'GET',
            'body': None,
            'description': 'Returns a single book object'
        },
    ]
    return Response(routes)

@api_view(['GET'])
def getBooks(request):
    books = Book.objects.all().order_by('-last_read') # order by doesn't work
    serializer  = BookSerializer(books, many=True) # serialize multiple objects as a queryset
    return Response(serializer.data)

def normalise(book, split_words):
    trimmed_split_words = [re.sub(r'[^a-zA-ZÀ-ÿ0-9\'-]+', '', x) for x in split_words]
    if book.normalisation is None or book.normalisation == '':
        nlp = spacy.load('fr_core_news_md')
        doc = nlp(f'{" ".join(trimmed_split_words)}')
        lemmas = {}
        for token in doc:
            if str(token) == ' ':
                continue
            if token.lemma_ in lemmas:
                if str(token).lower() in lemmas[token.lemma_]:
                    continue
                else:
                    lemmas[token.lemma_].append(str(token).lower())
            else:
                lemmas[token.lemma_] = [str(token).lower()]
        normalisation = lemmas
        book.normalisation = json.dumps(lemmas)
        book.save()
    else:
        normalisation = json.loads(book.normalisation)
        
    normalisation_format = {
        'lemma': 'list of source words'
    }
    return normalisation
    

@api_view(['GET'])
def getBook(request, pk, chap_num):
    book = Book.objects.get(id=pk) # gets one with id
    serializer = BookSerializer(book, many=False) # serialize one object as a queryset
        
    all_words = []
    sorted_serializer_chapters = sorted(serializer.data['chapters'], key=lambda d: d['num'])

    for i, chapter in enumerate(sorted_serializer_chapters):
        split_words = re.split(r'\s|\n', chapter['content'])

        split_words_para = [re.split(r'\s', para) for para in chapter['content'].split('\n')]
        sorted_serializer_chapters[i]['content'] = split_words_para
        
        all_words.extend(word.lower() for word in split_words)
        
    
    all_words = list(set(all_words)) # removes duplicates
    normalisation = normalise(book, all_words)
    return Response({'title': serializer['title'].value, 'chapter': sorted_serializer_chapters[int(chap_num)-1], 'normalisation': normalisation, 'numChapters': len(sorted_serializer_chapters)})

@api_view(['POST'])
def createTranslation(request, pk):
    data = request.data
    if Translation.objects.filter(term=data['term'], book_id=pk): # if term exists in the same book
        translation = Translation.objects.get(term=data['term'], book_id=pk)
        translation.timesTranslated += 1
        translation.save()
        return Response('')
    else:
        if Translation.objects.filter(term=data['term']): # if term exists in a different book
            translation = Translation.objects.get(term=data['term'])
            book = Book.objects.get(id=pk)       
            translation.book_id.add(book)
            translation.timesTranslated += 1
            translation.save()
        else:
            translator = Translator()
            definition = translator.translate(text=data['term'], dest='en', src='fr').text.lower()
            book = Book.objects.filter(id=pk)
            translation = Translation.objects.create(
                term=data['term'],
                definition=definition,
            )
            translation.book_id.set(book)
        serializer = TranslationSerializer(translation, many=False)
        return Response(serializer.data)

@api_view(['PUT'])
def updateTranslation(request, pk):
    data = request.data # should get array of modified translation dicts
    translation_ids = [t['id'] for t in data] # gets id of each translation if in book
    translations = Translation.objects.filter(pk__in=translation_ids)
    for i, instance in enumerate(translations):
        serializer = TranslationSerializer(instance=instance, data=data[i])

        if serializer.is_valid():
            serializer.save()

    return Response(data)


@api_view(['DELETE'])
def deleteTranslation(request, pk):
    data = request.data
    translation_id = data['id']
    translation = Translation.objects.get(id=translation_id)
    translation.delete()
    other = Translation.objects.filter(book_id = pk)
    serializer = TranslationSerializer(other, many=True)
    return Response(serializer.data)

@api_view(['DELETE'])
def deleteBook(request, pk):
    book = Book.objects.get(id=pk)
    book.delete()
    return Response('Book was deleted')

@api_view(['GET'])
def getTranslations(request, pk):
    book = Book.objects.get(id=pk) # gets one with id
    serializer = BookSerializer(book, many=False) # serialize one object as a queryset
    return Response(serializer.data) # translations dict

@api_view(['GET'])
def getTranslation(request, pk, word):
    translator = Translator()
    translation = translator.translate(text=word, dest='en', src='fr')
    return JsonResponse({'definition':translation.text.lower()})

@api_view(['POST'])
def createBook(request, book_name):
    new_book = send_to_db(book_name)
    if not new_book:
        return Response({'error': 'No book found'})
    if Book.objects.filter(title=new_book[0]):
        return Response({'error': 'Book with title already exists'})
    book = Book.objects.create(
        title=new_book[0]
    )
    # TODO: make field for author
    book.save()
    for chap in new_book[2:]: 
        chapter = Chapter(book=book, name=chap['name'], num=chap['num'], content=chap['content'])
        chapter.save()
    print('Book created')
    return JsonResponse(book)