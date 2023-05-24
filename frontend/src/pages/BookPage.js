import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { Link, useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import WordItem from "../components/WordItem";

// save translation to list on double click
// TODO: Highlight all instances of word
// TODO: Keep track of how many times word has been clicked

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
  let [timesTranslated, setTimesTranslated] = useState({});

  // adding dependencies prevents infinite loop
  useEffect(() => {
    let getBook = async () => {
      let response = await fetch(`/main/library/${bookId}/`); // backticks allow dynamic parameters
      let data = await response.json();
      // data is list of words in book

      setBook(data);
    };
    getBook();

    getTranslations();
  }, [bookId]);

  const getCounterByTerm = useCallback(
    (translations, term) => {
      const translation = translations.find(
        (dict) => dict.term.toLowerCase().trim() === term.toLowerCase().trim()
      );
      if (translation) {
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

  let [anchorEl, setAnchorEl] = React.useState(null);
  let open = Boolean(anchorEl);
  let handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  let handleClose = () => {
    setAnchorEl(null);
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
    let res = await fetch(`/main/library/${bookId}/${word.toLowerCase()}`); // backticks allow dynamic parameters
    let data = await res.json();
    setHoveredIndex(index);
    setTranslatedWord(data.text);
    isTranslated(true);
    //getTranslations();
  };

  // add dictionary hyperlink in hamburger for any failed translations
  // recognise different variants as same word (eg grand and grande, joue and jouer)

  const createTranslation = async (word) => {
    await fetch(`/main/library/${bookId}/translations/create/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ term: word.toLowerCase(), book_id: bookId }),
    });
    setTerms(terms.concat([word.toLowerCase()]));
    getTranslations();
    console.log("created translation");
  };

  const handleTranslation = async (e, word, indexBook) => {
    switch (e.detail) {
      case 1: // single click
        getTranslation(word, indexBook);
        break;
      case 2: // double click
        createTranslation(word, translatedWord);
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
      <div className="book-header">
        <h3>
          <ArrowBackIosIcon onClick={handleBack} />
        </h3>
        {book?.title}

        <IconButton
          aria-label="more"
          id="long-button"
          aria-controls={open ? "long-menu" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-haspopup="true"
          onClick={handleClick}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          id="long-menu"
          MenuListProps={{
            "aria-labelledby": "long-button",
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          PaperProps={{
            style: {
              maxHeight: 48 * 4.5,
              width: "20ch",
            },
          }}
        >
          <MenuItem onClick={handleClose}>Progress</MenuItem>
          <Link to={`/book/${bookId}/translations`}>
            <MenuItem>Translations</MenuItem>
          </Link>
          <MenuItem onClick={handleDelete}>
            <DeleteIcon />
          </MenuItem>
        </Menu>
      </div>
      <div className="chapter">
        {book?.map((word, index) =>
          word != "" ? (
            <WordItem
              key={index}
              index={index}
              hoveredIndex={hoveredIndex}
              handleTranslation={handleTranslation}
              word={word}
              translated={translated}
              translations={terms}
              translatedWord={translatedWord}
              setHoveredIndex={setHoveredIndex}
              underlineColour={getUnderlineColour(
                getCounterByTerm(translations, word)
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
