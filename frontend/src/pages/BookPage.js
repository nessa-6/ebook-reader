import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
import WordItem from "../components/WordItem";
import BookHeader from "../components/BookHeader";
import LoadingItem from "../components/LoadingItem";


// TODO: add chapters and pages

const BookPage = () => {
  let params = useParams();
  let history = useNavigate();
  let bookId = params.id;
  let [book, setBook] = useState(null); // default value is null
  let [translatedWord, setTranslatedWord] = useState(null);
  let [translated, isTranslated] = useState(false);
  let [translations, setTranslations] = useState([]);
  let [terms, setTerms] = useState([]);
  let [hoveredIndex, setHoveredIndex] = useState(null);
  let [lemmas, setLemmas] = useState({});

  // adding dependencies prevents infinite loop
  useEffect(() => {
    let getBook = async () => {
      let response = await fetch(`/main/library/${bookId}/`); // backticks allow dynamic parameters
      let data = await response.json();
      // data is a dict of list of words in book and lemmas

      setBook(data["words"]);
      setLemmas(data["normalisation"]);
    };
    getBook();

    getTranslations();
  }, [bookId]);

  const getCounterByTerm = useCallback(
    (translations, term) => {
      // find the dict/translation in translations with the value term
      const translation = translations.find(
        (dict) => dict.term.trim() === term.trim()
      );
      if (translation) { // if it exists i.e. if it has been translated before
        return translation.timesTranslated;
      } else {
        return 0;
      }
    },
    [translations]
  );

  const getTranslations = async () => {
    let res = await fetch(`/main/library/${bookId}/translations/`);
    let data = await res.json();
    let translationTerms = data["translations"].map(
      (translation) => translation["term"]
    );
    setTerms(translationTerms);
    setTranslations(data["translations"]);
  };

  let handleBack = () => {
    history("/"); // sends user back to homepage
  };

  let handleDelete = async () => {
    await fetch(`/main/library/${bookId}/delete/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    history("/");
  };

  const getTranslation = async (word, index) => {
    let res = await fetch(`/main/library/${bookId}/${word}`); // backticks allow dynamic parameters
    let translation = await res.json();
    setHoveredIndex(index);
    setTranslatedWord(translation.text);
    isTranslated(true);
    //getTranslations();
  };

  // add dictionary hyperlink in hamburger for any failed translations
  // recognise different variants as same word (eg grand and grande, joue and jouer)

  function getLemmaByValue(value) {
    let lemma = Object.keys(lemmas).find((lemma) => lemmas[lemma].includes(value));
    if (lemma == null) {
      lemma = value.toLowerCase()
    }
    return lemma
  }

  const createTranslation = async (lemma) => {
    await fetch(`/main/library/${bookId}/translations/create/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        term: lemma,
        book_id: bookId,
      }),
    });
    setTerms(terms.concat([lemma]));
    getTranslations();
  };

  const handleTranslation = async (e, trimmedWord, indexBook) => {
    switch (e.detail) {
      case 1: // single click
        getTranslation(trimmedWord, indexBook);
        break;
      case 2: // double click
        let lemma = getLemmaByValue(trimmedWord.toLowerCase());
        createTranslation(lemma);
        break;
    }
  };
  const getUnderlineColour = (timesTranslated) => {
    switch (timesTranslated) {
      case 0:
        return "green";
      case 1:
        return "green";
      case 2:
        return "yellow";
      case 3:
        return "red";
      default:
        return "black";
    }
  };

  return (
    <div className="book">
      <BookHeader
        handleBack={handleBack}
        book={book}
        bookId={bookId}
        handleDelete={handleDelete}
      />
      
      <div className="chapter">
        {book?.map((word, index) =>
          word != "" ? (
            <WordItem
              key={index}
              index={index}
              hoveredIndex={hoveredIndex}
              handleTranslation={handleTranslation}
              word={word}
              trimmedWord={word.replace(/[^a-zA-Z0-9]+$/, "")}
              lemma={getLemmaByValue(word.replace(/[^a-zA-Z0-9]+$/, "").toLowerCase())}
              translated={translated}
              translations={terms}
              translatedWord={translatedWord}
              setHoveredIndex={setHoveredIndex}
              underlineColour={getUnderlineColour(
                getCounterByTerm(translations, getLemmaByValue(word.replace(/[^a-zA-Z0-9]+$/, "")))
              )}
            />
          ) : (
            <p key={index} className="break"></p>
          )
        )}
      </div>
    </div>
  );
};

export default BookPage;
