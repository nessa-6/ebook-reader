// used rafce snippet

import React, { useState, useEffect } from "react";
import ListItem from '../components/ListItem'

const LibraryPage = () => {
  let [books, setBooks] = useState([]);

    useEffect(() => { 
        getBooks()
    }, []);
    
    let getBooks = async () => {
        // await for data to be fetched from url then store (no promise)
        let response = await fetch('/main/library/') // added proxy url
        // parse response
        let data = await response.json()
        // update state
        setBooks(data)
    } 

    return (
        <div className="books">
            <div className="books-header">
                <h2 className="books-title">&#9782; Books</h2>
                <p className="books-count">{books.length}</p>
            </div>

            <div className="books-list">
                {books.map((book, index) => (
                    <ListItem key={index} book={book} />
                ))}
            </div>
        </div>
    );
};

export default LibraryPage;

/*
{dict?.map((x) => (
    <ListItem key={x.id}>
      <textarea defaultValue={x["term"]}></textarea>
    </ListItem>
))
}
  */