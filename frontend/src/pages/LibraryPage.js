// used rafce snippet

import React, { useState, useEffect } from "react";

const LibraryPage = () => {
  let [books, setBooks] = useState([]);

    useEffect(() => { 
        getBooks()
    }, []);
    
    let getBooks = async () => {
        // await for data to be fetched from url then store (no promise)
        let response = await fetch('http://127.0.0.1:8000/main/library/')
        // parse response
        let data = await response.json()
        // update state
        setBooks(data)
    } 

    return (
        <div>
            <div className="library">
                {books.map((book, index) => (
                    <h3 key={index}>{book.body}</h3>
                ))}
            </div>
        </div>
    );
};

export default LibraryPage;
