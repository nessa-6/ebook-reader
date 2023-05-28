import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
import WordItem from "../components/WordItem";
import BookHeader from "../components/BookHeader";
import Slider from "@mui/material/Slider";
import CircularProgress from '@mui/material/CircularProgress';


// TODO: add search functionality to hamburger
// TODO: add react heatmap for progress
// add dictionary hyperlink in hamburger for any failed translations
// recognise different variants as same word (eg grand and grande, joue and jouer)
// TODO: underline based on lemma, but store based on individual word


const BookPage = () => {
  let params = useParams();
  let navigate = useNavigate();
  let bookId = params.id;
  let bookTitle = params.title;
  const notWords = [" ", "?", "!", "-"];
  let [chapters, setChapters] = useState(null);
  let [translatedWord, setTranslatedWord] = useState(null);
  let [translated, isTranslated] = useState(false);
  let [translations, setTranslations] = useState([]);
  let [lemmaTerms, setLemmaTerms] = useState([]);
  let [originalTerms, setOriginalTerms] = useState([]);
  let [hoveredIndex, setHoveredIndex] = useState(null);
  let [allLemmas, setAllLemmas] = useState({});
  let [currentChapterNum, setCurrentChapterNum] = useState(1);
  let [currentChapter, setCurrentChapter] = useState({});

  function valuetext(value) {
    return `${value}`;
  }

  useEffect(() => {
    // Fetch chapters and lemmas data for the book
    const getBook = async () => {
      let response = await fetch(`/main/library/${bookId}/`);
      let data = await response.json();
      setChapters(data["chapters"]);
      setAllLemmas(data["normalisation"]);
    };
    getBook();
    getTranslations();
  }, [bookId]);

  useEffect(() => {
    // Update lemma and original term lists when translations change
    setLemmaTerms(translations.map((dict) => getLemmaByValue(dict["term"])));
    setOriginalTerms(translations.map((dict) => dict["term"]));
  }, [translations]);

  useEffect(() => {
    // Update current chapter when the current chapter number changes
    const getChapterByNum = () => {
      let chapter = chapters?.find((dict) => dict.num === parseInt(currentChapterNum));
      setCurrentChapter(chapter);
    };
    getChapterByNum();
  }, [chapters, currentChapterNum]);

  const handleChapterChange = (event, value) => {
    setCurrentChapterNum(value);
  };

  let handleDelete = async () => {
    await fetch(`/main/library/${bookId}/delete/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    navigate("/");
  };

  function getLemmaByValue(value) {
    let lemma = Object.keys(allLemmas).find((lemma) => allLemmas[lemma].includes(value));
    if (lemma == null) {
      lemma = value.toLowerCase();
    }
    return lemma;
  }

  const handleTranslation = async (e, trimmedWord, indexBook) => {
    switch (e.detail) {
      case 1: // single click
        getTranslation(trimmedWord, indexBook);
        break;
      case 2: // double click
        let lemma = getLemmaByValue(trimmedWord);
        createTranslation(trimmedWord, lemma);
        break;
    }
  };

  const getTranslations = async () => {
    let res = await fetch(`/main/library/${bookId}/translations/`);
    let data = await res.json();
    let translationTerms = data["translations"].map((translation) => translation["term"]);
    setOriginalTerms(translationTerms);
    setTranslations(data["translations"]);
  };

  const getTranslation = async (word, index) => {
    let translation = "";
    if (originalTerms.includes(word)) {
      translation = translations.find((dict) => dict.term.trim() === word.trim());
    } else {
      let res = await fetch(`/main/library/${bookId}/${word}`);
      translation = await res.json();
    }

    setHoveredIndex(index);
    setTranslatedWord(translation.definition);
    isTranslated(true);
  };

  const getCounterByTerm = useCallback(
    (translations, lemma) => {
      let translation = "";

      // Check if allLemmas and allLemmas[lemma] exist and are arrays
      if (allLemmas && Array.isArray(allLemmas[lemma])) {
        translation = translations.filter((dict) => allLemmas[lemma].includes(dict.term.trim()));
      } else if (allLemmas && !Array.isArray(allLemmas[lemma])) {
        translation = translations.filter((dict) => dict.term.trim() === lemma.trim().toLowerCase());
      }

      if (translation) {
        // Find the maximum 'timesTranslated' value
        const maxTimesTranslated = translation.reduce((maxValue, dictionary) => {
          const timesTranslated = dictionary.timesTranslated;
          return timesTranslated > maxValue ? timesTranslated : maxValue;
        }, 0);

        return maxTimesTranslated;
      } else {
        return 0;
      }
    },
    [translations, allLemmas]
  );

  const createTranslation = async (trimmedWord, lemma) => {
    await fetch(`/main/library/${bookId}/translations/create/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        term: trimmedWord,
        book_id: bookId,
      }),
    });
    setOriginalTerms((prevState) => [...prevState, trimmedWord]);
    setLemmaTerms((prevState) => [...prevState, lemma]);
    getTranslations();
  };

  const getUnderlineColour = (timesTranslated) => {
    switch (timesTranslated) {
      case 0:
        return "cream";
      case 1:
        return "#85EC91";
      case 2:
        return "#D5EA81";
      case 3:
        return "#FBB95F";
      case 4:
        return "#F68A6A";
      case 5:
        return "#BE4A4A";
      default:
        return "#811717";
    }
  };

  return (
    <div className="book">
      <BookHeader bookId={bookId} bookTitle={bookTitle} handleDelete={handleDelete} />

      <p className="chapter-name">{currentChapter?.name}</p>
      <div className="chapter">
        {currentChapter && currentChapter.content ? (
          currentChapter?.content?.map((word, index) =>
            notWords.includes(word) === false ? (
              <WordItem
                key={index}
                index={index}
                hoveredIndex={hoveredIndex}
                handleTranslation={handleTranslation}
                word={word}
                trimmedWord={word.replace(/[^a-zA-ZÀ-ÿ0-9\'-]+/, "").toLowerCase()}
                lemma={getLemmaByValue(word.replace(/[^a-zA-ZÀ-ÿ0-9\'-]+/, "").toLowerCase())}
                translated={translated}
                translations={lemmaTerms}
                translatedWord={translatedWord}
                setHoveredIndex={setHoveredIndex}
                underlineColour={getUnderlineColour(getCounterByTerm(translations, getLemmaByValue(word.replace(/[^a-zA-ZÀ-ÿ0-9\'-]+/, "").toLowerCase())))}
              />
            ) : word === "" ? (
              <p key={index} className="break"></p>
            ) : (
              <p key={index} className="word">
                {word}
              </p>
            )
          )
        ) : (
          <span className="loader"></span>
        )}
      </div>
      <div className="empty"></div>
      <Slider
        className="page-slider"
        aria-label="page-slider"
        defaultValue={1}
        onChange={handleChapterChange}
        getAriaValueText={valuetext}
        step={1}
        min={1}
        max={chapters?.length}
        valueLabelDisplay="auto"
        style={{ width: "96%", color: "#58BADC" }}
      />
    </div>
  );
};

export default BookPage;
