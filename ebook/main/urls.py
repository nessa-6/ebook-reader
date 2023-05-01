from django.urls import path
from . import views

urlpatterns = [
    path('', views.getRoutes, name="routes"),
    path('library/', views.getBooks, name="library"),
    path('library/<str:pk>/', views.getBook, name="book"),

]
