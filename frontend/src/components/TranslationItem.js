import React from 'react'
import { Link } from 'react-router-dom'

// destructures translation dict
const TranslationItem = ({value, onChange, type}) => {
  return (
    <div className="translation-list-item">
      {type === "term" ? (
        <textarea
          value={value != null ? value : ""}
          onChange={onChange}
          disabled
          style={{backgroundColor:'inherit'}}
        ></textarea>
      ) : (
        <textarea
          value={value != null ? value : ""}
          onChange={onChange}
        ></textarea>
      )}
    </div>
  );
}

export default TranslationItem

