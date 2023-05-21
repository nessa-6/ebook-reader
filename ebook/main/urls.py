from django.urls import path
from . import views

urlpatterns = [
    path('', views.getRoutes, name="routes"),
    path('library/', views.getBooks, name="library"),
    path('library/<str:pk>/update/', views.updateTranslation, name="update-translation"),
    path('library/<str:pk>/translations/', views.getTranslations, name="translations-list"),
    path('library/<str:pk>/', views.getBook, name="book"),

]

# TODO:add dynamic param for pages
