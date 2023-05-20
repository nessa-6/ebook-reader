from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Book, Translation
from .serializers import BookSerializer, TranslationSerializer

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
    books = Book.objects.all().order_by('-last_read')
    serializer  = BookSerializer(books, many=True) # serialize multiple objects as a queryset
    return Response(serializer.data)

@api_view(['GET'])
def getBook(request, pk):
    books = Book.objects.get(id=pk) # gets one with id
    serializer = BookSerializer(books, many=False) # serialize one object as a queryset
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

@api_view(['GET'])
def getTranslations(request, pk):
    book = Book.objects.get(id=pk) # gets one with id
    serializer = BookSerializer(book, many=False) # serialize one object as a queryset
    return Response(serializer.data)
        