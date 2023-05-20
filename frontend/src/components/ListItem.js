import React from 'react'
import { Link } from 'react-router-dom'

// destructures book
const ListItem = ({book}) => {
  return (
    <Link to={`/book/${book.id}`}>
      <div className="books-list-item">
        <h3>{book.title}</h3>
      </div>
    </Link>
  );
}

export default ListItem

