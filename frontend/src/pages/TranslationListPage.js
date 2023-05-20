import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { Link, useNavigate } from "react-router-dom";
import TranslationItem from "../components/TranslationItem";
import { Button } from "@mui/material";

let data = [];

const TranslationListPage = () => {
  let params = useParams();
  let history = useNavigate();
  let bookId = params.id;
  let [dict, setDict] = useState(null);
  let [modifiedIndices, setModifiedIndices] = useState([]);

  useEffect(() => {
    let getDict = async () => {
      let response = await fetch(`/main/library/${bookId}/translations/`);
      let data = await response.json();
      console.log(data);
      let translations = data["translations"];
      setDict(translations);
    };
    getDict();
  }, [bookId]); // dependency

  let updateTranslation = async (updatedData) => {
    await fetch(`/main/library/${bookId}/update/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData.modifiedDicts),
    });
  };

  let handleOnChange = (index, field, value) => {
    const newData = [...dict];
    newData[index][field] = value;
    //data["translations"] = newData;
    setDict(newData);
    // Add the modified index to the modifiedIndices state if it's not already present
    if (!modifiedIndices.includes(index)) {
      setModifiedIndices([...modifiedIndices, index]);
    }
  };

  let handleSubmit = () => {
    if (modifiedIndices.length > 0) {
      const modifiedDicts = modifiedIndices.map((index) => dict[index]);
      updateTranslation({ modifiedDicts });
    }
  };

  return (
    <div className="book">
      <div className="book-header">
      <h3>
        <Link to="/">
          <ArrowBackIosIcon />
        </Link>
        </h3>
        <h2>{dict?.length} Translations</h2>
      </div>
      

      <div className="books-list">
        {dict?.map((x, index) => (
          <div key={index} className="translation-container">
            <TranslationItem
              key={`term_${index}`}
              defaultValue={x['term']}
              onChange={(e) => handleOnChange(index, "term", e.target.value)}
            />
            <TranslationItem
              key={`definition_${index}`}
              defaultValue={x["definition"]}
              onChange={(e) =>
                handleOnChange(index, "definition", e.target.value)
              }
            />
            <button onClick={() => handleSubmit(index)}>Submit</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TranslationListPage;
