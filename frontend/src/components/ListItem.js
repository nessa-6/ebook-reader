import React from 'react'
import { Link } from 'react-router-dom'

// destructures book
const ListItem = ({book}) => {
  return (
      <Link to={`/book/${book.id}`}>
          <h3>{book.title}</h3>
    </Link>
  )
}

export default ListItem