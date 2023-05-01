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
        <div>
            <div className="library">
                {books.map((book, index) => (
                    <ListItem key={index} book={book} />
                ))}
            </div>
        </div>
    );
};

export default LibraryPage;
