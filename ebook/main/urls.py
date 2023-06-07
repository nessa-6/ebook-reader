from django.urls import path
from . import views

urlpatterns = [
    path('', views.getRoutes, name="routes"),
    path('library/', views.getBooks, name="library"),
    path('library/create/<str:book_name>/', views.createBook),
    path('library/<str:pk>/translations/', views.getTranslations, name="translations-list"),
    path('library/<str:pk>/translations/update/', views.updateTranslation, name="update-translation"),
    path('library/<str:pk>/translations/delete/', views.deleteTranslation, name="delete-translation"),
    path('library/<str:pk>/translations/create/', views.createTranslation, name="create-translation"),
    path('library/<str:pk>/<str:chap_num>/', views.getBook, name="book"),
    path('library/<str:pk>/delete/', views.deleteBook, name="delete-book"),
    path('library/<str:pk>/translations/<str:word>/', views.getTranslation),

]