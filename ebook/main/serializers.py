from rest_framework.serializers import ModelSerializer
from .models import Book, Translation

        
class TranslationSerializer(ModelSerializer):
    class Meta:
        model = Translation
        fields = '__all__'
        
class BookSerializer(ModelSerializer):
    translations = TranslationSerializer(many=True, read_only=True) # relates to foreign field translations
    class Meta:
        model = Book
        fields = '__all__'