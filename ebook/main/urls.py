from django.urls import path
from . import views

urlpatterns = [
    path('', views.getRoutes, name="routes"),
    path('library/', views.getBooks, name="library"),
    path('library/create/<str:book_name>/', views.createBook),
    path('library/<int:pk>/translations/', views.getTranslations, name="translations-list"),
    path('library/<int:pk>/translations/update/', views.updateTranslation, name="update-translation"),
    path('library/<int:pk>/translations/delete/', views.deleteTranslation, name="delete-translation"),
    path('library/<int:pk>/translations/create/', views.createTranslation, name="create-translation"),
    path('library/<int:pk>/<int:chap_num>/update/', views.updateCurrentChapter, name="chapter"),
    path('library/<int:pk>/<int:chap_num>/', views.getBook, name="book"),
    path('library/<int:pk>/delete/', views.deleteBook, name="delete-book"),
    path('library/<int:pk>/translations/<str:word>/', views.getTranslation),

]