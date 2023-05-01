import React from 'react'

// destructures book
const ListItem = ({book}) => {
  return (
      <div>
          <h3>{book.body}</h3>
    </div>
  )
}

export default ListItem