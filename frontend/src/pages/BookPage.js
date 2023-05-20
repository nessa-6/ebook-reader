import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { Link, useNavigate } from "react-router-dom";
import ListItem from "../components/ListItem";

const BookPage = () => {
  let params = useParams();
  let history = useNavigate();
  let bookId = params.id;
  let [book, setBook] = useState(null); // default value is null

  // adding dependencies prevents infinite loop
  useEffect(() => {
    let getBook = async () => {
      let response = await fetch(`/main/library/${bookId}/`); // backticks allow dynamic parameters
      let data = await response.json();
      // data is dict with fields id, transaltions, title, body, last_read
      // console.log(data);
      
      setBook(data);
    };
    getBook();
  }, [bookId]);


  let handleSubmit = () => {
    history("/"); // sends user back to homepage
  };
  
  return (
    <div className="book">
      <div className="book-header">
        <h3>
          <ArrowBackIosIcon onClick={handleSubmit} />
        </h3>
        {book?.title}
      </div>
      <p>{book?.body}</p>
    </div>
  );
};

export default BookPage;
