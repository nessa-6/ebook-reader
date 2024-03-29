import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import WordItem from "../components/WordItem";
import BookHeader from "../components/BookHeader";
import Slider from "@mui/material/Slider";
import {
  AutoSizer,
  List,
  CellMeasurer,
  CellMeasurerCache,
} from "react-virtualized";


// TODO: add search functionality to hamburger
// TODO: add react heatmap for progress
// add dictionary hyperlink in hamburger for any failed translations
// TODO: stay on same page on refresh


const BookPage = () => {
  let params = useParams();
  let navigate = useNavigate();
  let bookId = params.id;
  let bookTitle = params.title;
  // TODO: add current Chapter into params
  const notWords = [" ", "?", "!", "-", "—", ":", ";"]; // specific characters that should not be treated as valid words
  let [book, setBook] = useState([]); // array of chapters for the book once accessed
  let [chapterNum, setChapterNum] = useState(null);
  let [translatedWord, setTranslatedWord] = useState(null);
  let [translated, isTranslated] = useState(false);
  let [translations, setTranslations] = useState([]);
  let [hoveredIndex, setHoveredIndex] = useState(null);
  let [currentChapterNum, setCurrentChapterNum] = useState(1);
  let [currentChapter, setCurrentChapter] = useState(null);

  // formats the value of the Slider component
  function valuetext(value) {
    return `${value}`;
  }

  // Fetches the translations for the book from the server
  const getTranslations = useCallback(async () => {
    let res = await fetch(`/main/library/${bookId}/translations/`);
    let data = await res.json();
    setTranslations(data);
  }, [bookId]); // no external dependencies so function is memoized and will not be recreated on every render

  useEffect(() => {
    // Fetch chapters and lemmas data for the book
    const getChapter = async () => {
      const isInBook = book.find(
        (chapter) => chapter["num"] === currentChapterNum
      );
      if (isInBook === undefined) {
        let response = await fetch(
          `/main/library/${bookId}/${currentChapterNum}`
        );
        let data = await response.json();
        if (!book?.length) {
          // on first render
          setCurrentChapterNum(data["currentChapterNum"]);
          setChapterNum(data["numChapters"]);
        } else {
          setCurrentChapter(data["chapter"]);
        }
        setBook((prevChaps) =>
          [...prevChaps, data["chapter"]].sort((a, b) => a.num - b.num)
        );
      } else {
        setCurrentChapter(isInBook);
      }
    };
    getChapter();
    if (translations === undefined || translations.length == 0) {
      getTranslations();
    }
  }, [bookId, currentChapterNum, book, getTranslations]);

  // Handles the change event of the Slider component to update the current chapter
  const handleChapterChange = (event, value) => {
    setCurrentChapterNum(value);
  };

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = "";
  
      saveProgress();
    };
  
    const saveProgress = () => {
      const scrollPosition = window.scrollY;
      console.log(scrollPosition)
      sessionStorage.setItem("scrollPosition", scrollPosition.toString());
  
      // Perform the PUT request or save the progress to the server
      fetch(`/main/library/${bookId}/${currentChapterNum}/update/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });
    };
  
    const handleLoad = () => {
      const scrollPosition = sessionStorage.getItem("scrollPosition");
      if (scrollPosition) {
        window.scrollTo(0, parseInt(scrollPosition));
        sessionStorage.removeItem("scrollPosition");
      }
    };
  
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("load", handleLoad);
  
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("load", handleLoad);
    };
  }, [bookId, currentChapterNum]);

  

  let handleDelete = async () => {
    await fetch(`/main/library/${bookId}/delete/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    navigate("/");
  };

  const handleTranslation = async (e, trimmedWord, indexBook) => {
    switch (e.detail) {
      case 1: // single click
        getTranslation(trimmedWord, indexBook);
        break;
      case 2: // double click
        createTranslation(trimmedWord);
        break;
      default:
        break;
    }
  };

  const getTranslation = async (word, index) => {
    // if word has been clicked before
    let translation = translations.find(
      (dict) => dict.term.trim() === word.trim()
    );
    // if first time clicked
    if (translation === undefined) {
      let res = await fetch(`/main/library/${bookId}/translations/${word}`);
      translation = await res.json();
    }      

    setHoveredIndex(index);
    setTranslatedWord(translation.definition);
    isTranslated(true);
  };

  const getCounterByTerm = useCallback(
    (word) => {
      let translation = translations.find((dict) =>
        Object.values(dict.lemma_vals).some((lemmaList) =>
          lemmaList.includes(word)
        )
      );


      if (translation) {
        const lemmas = translation.lemma_vals;
        let maxTimesTranslated = 0;
        if (Object.values(lemmas).length === 1) { // if only one lemma value in the lemma dict (ie no variations of word)
          maxTimesTranslated = translation.timesTranslated
        } else {
          Object.keys(lemmas).map(function (key) {
            for (const lemma of lemmas[key]) {
              // Find the corresponding translation dictionary with matching lemma and get its timesTranslated value
              const matchingTranslation = translations.find(
                (dict) => splitContractions(trimWord(dict.term)) === trimWord(lemma)
              );
  
              if (
                matchingTranslation &&
                matchingTranslation.timesTranslated > maxTimesTranslated
              ) {
                maxTimesTranslated = matchingTranslation.timesTranslated;
              }
            }
          });
        }


        return maxTimesTranslated;
      } else {
        return 0;
      }
    },
    [translations]
  );

  const createTranslation = async (trimmedWord) => {
    await fetch(`/main/library/${bookId}/translations/create/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        term: trimmedWord,
      }),
    });
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

  const cache = new CellMeasurerCache({
    fixedWidth: true,
    defaultHeight: 100,
    });

  let trimWord = (word) => { // removes punctuations
    return word
      .toLowerCase()
      .replace(/[^a-zA-ZÀ-ÿ0-9'\u2019-]+/, "")
      .replace('\u2019', "'")
  };

  let splitContractions = (trimmedWord) => {
    return trimmedWord.replace(/d'|l'|n'|s'|c'|j'|m'|t'/, "")

  }

  const rowRenderer = useCallback(
    ({ index, key, style, parent }) => {
      const paragraph = currentChapter?.content[index];

      return (
        <CellMeasurer
          key={key}
          cache={cache}
          parent={parent}
          columnIndex={0}
          rowIndex={index}
        >
          {({ registerChild, measure }) => (
            <div
              className="paragraph"
              ref={registerChild}
              style={style}
              onLoad={measure}
            >
              {paragraph.map((word, idx) =>
                notWords.includes(word) === false ? (
                  <WordItem
                    key={`${index}-${idx}`}
                    index={`${index}-${idx}`}
                    hoveredIndex={hoveredIndex}
                    handleTranslation={handleTranslation}
                    word={word}
                    trimmedWord={trimWord(word)}
                    noContractionsWord={splitContractions(trimWord(word))}
                    translated={translated}
                    lemma_dict={
                      translations?.find((dict) =>
                        Object.values(dict.lemma_vals).some((lemmaList) =>
                          lemmaList.includes(splitContractions(trimWord(word)))
                        )
                      )?.lemma_vals
                    }
                    translatedWord={translatedWord}
                    setHoveredIndex={setHoveredIndex}
                    underlineColour={getUnderlineColour(
                      getCounterByTerm(splitContractions(trimWord(word)))
                    )}
                  />
                ) : word === "" ? (
                  <p key={`${index}-${idx}`} className="break"></p>
                ) : (
                  <p key={`${index}-${idx}`} className="word">
                    {word}
                  </p>
                )
              )}
            </div>
          )}
        </CellMeasurer>
      );
    },
    [currentChapter, cache]
  );

  return (
    <div className="book">
      <BookHeader
        bookId={bookId}
        bookTitle={bookTitle}
        handleDelete={handleDelete}
        currentChapterNum={currentChapterNum}
      />

      <p className="chapter-name">{currentChapter?.name}</p>
      <div className="chapter">
        {currentChapter && currentChapter.content ? (
          <AutoSizer>
            {({ height, width }) => (
              <List
                height={height}
                width={width}
                rowCount={currentChapter.content.length}
                deferredMeasurementCache={cache}
                rowHeight={cache.rowHeight} // Adjust the row height as needed
                rowRenderer={rowRenderer}
              />
            )}
          </AutoSizer>
        ) : (
          <span className="loader"></span>
        )}
      </div>
      <Slider
        className="page-slider"
        aria-label="page-slider"
        value={currentChapterNum}
        onChange={handleChapterChange}
        getAriaValueText={valuetext}
        step={1}
        min={1}
        max={chapterNum}
        valueLabelDisplay="auto"
        style={{ width: "96%", color: "#58BADC" }}
      />
    </div>
  );
};

export default BookPage;