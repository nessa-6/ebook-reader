from django.shortcuts import render
from django.http import JsonResponse
# Create your views here.

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
    return JsonResponse(routes, safe=False)