from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Book
from .serializers import BookSerializer

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
        }
    ]
    return Response(routes)

@api_view(['GET'])
def getBooks(request):
    books = Book.objects.all()
    serializer  = BookSerializer(books, many=True) # serialize multiple objects as a queryset
    return Response(serializer.data)

@api_view(['GET'])
def getBook(request, pk):
    books = Book.objects.get(id=pk) # gets one with id
    serializer  = BookSerializer(books, many=False) # serialize one object as a queryset
    return Response(serializer.data)