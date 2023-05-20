import React from 'react'
import { Link } from 'react-router-dom'

// destructures translation dict
const TranslationItem = ({defaultValue, onChange}) => {
  return (
    <div className="translation-list-item">
      <textarea defaultValue={defaultValue} onChange={onChange}></textarea>
    </div>
  );
}

export default TranslationItem

