from rest_framework.serializers import ModelSerializer
from .models import Book, Translation, Chapter

        
class TranslationSerializer(ModelSerializer):
    class Meta:
        model = Translation
        fields = '__all__'
        
        
class ChapterSerializer(ModelSerializer):
    class Meta:
        model = Chapter
        fields = '__all__'
        
class BookSerializer(ModelSerializer):
    translations = TranslationSerializer(many=True, read_only=True) # relates to foreign field translations
    chapters = ChapterSerializer(many=True)
    class Meta:
        model = Book
        fields = '__all__'