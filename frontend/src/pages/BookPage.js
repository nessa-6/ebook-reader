import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { Link } from 'react-router-dom'


const BookPage = ({ match }) => {
  let params = useParams();
  let bookId = params.id;
  let [book, setBook] = useState(null); // default value is null

  // adding dependencies prevents infinite loop
  useEffect(() => {
    let getBook = async () => {
      let response = await fetch(`/main/library/${bookId}/`); // backticks allow dynamic parameters
      let data = await response.json();
      setBook(data);
    };
    getBook();
  }, [bookId]);
  
    return (
      <div className="book">
        <div className="book-header">
          <h3>
            <Link to='/'>
              <ArrowBackIosIcon/>
            </Link>
          </h3>
          {book?.title}
        </div>
      <p>{book?.body}</p>
      {/* ? avoids errors from book not loading yet */}
    </div>
  );
};

export default BookPage;
