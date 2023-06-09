import ebooklib
from ebooklib import epub
import re
from bs4 import BeautifulSoup


def laselection_format(file, identifier, chapter_class, contents_classes):
    raw_book = epub.read_epub(file)
    chapters = []

    for doc in raw_book.get_items_of_type(ebooklib.ITEM_DOCUMENT):
        if re.findall(rf':{identifier}\d+:', str(doc)):
            chapters.append(doc)

    book = [raw_book.title, raw_book.get_metadata('DC', 'creator')[0][0]]
    num = 1
    for chap in chapters:
        messy_content = chap.content.decode('utf-8')
        soup = BeautifulSoup(messy_content, 'html.parser')
        chapter_div = soup.find(class_=chapter_class)
        
        if chapter_div is None:
            continue
        chapter_title = chapter_div.text.strip()

        content = []
        paragraphs = soup.find_all('p', class_=contents_classes)

        
        for paragraph in paragraphs:
            content.append(re.sub('\xa0', ' ', paragraph.text.strip()))
        trimmed_content = [x for x in content if x!= '']
        if not trimmed_content:
            continue
        metadata = {
            'num': num,
            'name': chapter_title,
            'content': '\n'.join(trimmed_content),
        }
        book.append(metadata)
        num += 1

    return book


def send_to_db(name):
    books = {
        'laselection': [
            laselection_format,
            r'C:\Users\vanes_vv65bc4\VS Code\ebook-reader\ebook\main\books\la selection - kiera cass.epub',
            'c',
            'chap_n',
            ['p_let', 'txt_courant_justif']
        ],
        'legend': [laselection_format, r'C:\Users\vanes_vv65bc4\VS Code\ebook-reader\ebook\main\books\legend - marie lu.epub', 'id', 'calibre5', ['calibre1', 'small1', 'initial']]
        # Add other books here
    }

    if name not in books:
        return False

    book_format = books[name]
    book = book_format[0](file=book_format[1], identifier=book_format[2], chapter_class=book_format[3], contents_classes=book_format[4])

    # Send to backend or perform further operations
    
    return book


# Usage example
#send_to_db('legend')

    

def prohpetiedeglendower():
    book = epub.read_epub('Stiefvater, Maggie - La prophétie de Glendower (2011, Hachette) - libgen.li.epub') # returns instance of ebooklib.epub.EpubBook class
    
    for item in book.get_items_of_type(ebooklib.ITEM_DOCUMENT):
        if item.id == 'c3.html':
            print(item.get_body_content())
            break
            
        
        
    return ''
    for doc in rawbook.get_items_of_type(ebooklib.ITEM_DOCUMENT):
        content = doc.get_content().decode('utf-8')
        soup = BeautifulSoup(content, 'html.parser')
        print(soup)
        

# BOOKS:
#chapters = laselection_format('book.epub')
# chapters = legend_format('legend - marie lu.epub')
# chapters = prophetiedeglendower()

# Example
# chapter = chapters[4]
# text = chapter['pages']
# pg = text[2]
# print('\n'.join(re.sub('\xa0|\n', ' ', line) for line in pg if re.sub('\xa0|\n', ' ', line)  != ' '))


#book_name = input('Enter book name: ')
#print(send_to_db(book_name))

