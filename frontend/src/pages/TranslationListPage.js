import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { Link } from "react-router-dom";
import TranslationItem from "../components/TranslationItem";
import DeleteIcon from "@mui/icons-material/Delete";

// TODO: Make links to references in text
// TODO: Sort by timeTranslated
// TODO: Add search functionality

const TranslationListPage = () => {
  let params = useParams();
  let bookId = params.id;
  let bookTitle = params.title;
  let [dict, setDict] = useState(null);
  let [modifiedIndices, setModifiedIndices] = useState([]);

  useEffect(() => {
    let getDict = async () => {
      let response = await fetch(`/main/library/${bookId}/translations/`);
      let data = await response.json();
      let translations = data["translations"];
      translations.sort(function (a, b) {
        return b.timesTranslated - a.timesTranslated;
      }); // sort by number of times translated
      setDict(translations);
      console.log(translations);
    };
    getDict();
  }, [bookId]); // dependency

  let updateTranslation = async (updatedData) => {
    if (updatedData) {
      await fetch(`/main/library/${bookId}/translations/update/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData.modifiedDicts),
      });
    }
  };

  let deleteTranslation = async (translation, index) => {
    let response = await fetch(`/main/library/${bookId}/translations/delete/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: translation["id"] }),
    });
    if (response.status === 200) {
      let data = await response.json();
      setDict(data);
    }
  };

  let handleOnChange = (e, index, field, value) => {
    e.preventDefault();
    const newData = [...dict];
    newData[index][field] = value;
    setDict(newData);
    // Add the modified index to the modifiedIndices state if it's not already present
    if (!modifiedIndices.includes(index)) {
      setModifiedIndices([...modifiedIndices, index]);
    }
  };

  let handleSubmit = () => {
    if (modifiedIndices.length > 0) {
      let modifiedDicts = modifiedIndices
        .map((index) => dict[index])
        .filter((item) => item !== undefined);
      updateTranslation({ modifiedDicts });
    }
  };

  // in translations page you can edit translation, see wiki dictionary, number of times clicked, previews of sentences examples
  // get rid of submit, all should change on arrow click
  return (
    <div className="book">
      <div className="book-header">
        <h3>
          <Link to={`/book/${bookId}/${bookTitle}`}>
            <ArrowBackIosIcon onClick={() => handleSubmit()} />
          </Link>
        </h3>
        <h2>{dict?.length} Translations</h2>
      </div>

      <div className="books-list">
        <div className="table-header">
          <ul>Term</ul>
          <ul>Definition</ul>
          <ul>Times Translated</ul>
        </div>
        {dict ? (
          dict?.map((x, index) => (
            <div key={index} className="translation-container">
              <TranslationItem
                key={`term_${index}`}
                value={x["term"]}
                type="term"
              />
              <TranslationItem
                key={`definition_${index}`}
                value={x["definition"]}
                type="definition"
                onChange={(e) =>
                  handleOnChange(e, index, "definition", e.target.value)
                }
              />
              <div className="icons">
                <div className="timesTranslated">{x["timesTranslated"]}</div>
                <DeleteIcon
                  cursor="pointer"
                  onClick={() => deleteTranslation(x, index)}
                />
              </div>
            </div>
          ))
        ) : (
          <span className="loader"></span>
        )}
      </div>
    </div>
  );
};

export default TranslationListPage;
