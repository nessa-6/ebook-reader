import React from 'react'
import { Link } from 'react-router-dom'

// destructures translation dict
const TranslationItem = ({value, onChange, type}) => {
  return (
    <div className="translation-list-item">
      <textarea value={value} onChange={onChange} disabled={type === 'term'}></textarea>
    </div>
  );
}

export default TranslationItem

