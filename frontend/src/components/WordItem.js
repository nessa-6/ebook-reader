import React from "react";

const WordItem = ({
  index,
  hoveredIndex,
  handleTranslation,
  word,
  trimmedWord,
  translated,
  lemma_dict,
  translatedWord,
  setHoveredIndex,
  underlineColour,
}) => {
  let lemma_vals = null
  if (lemma_dict) {
    lemma_vals = Object.values(lemma_dict)[0];
  }
  return (
    <div
      key={index}
      className={hoveredIndex === index ? "clicked-word" : "word"}
      onClick={(e) => handleTranslation(e, trimmedWord, index)}
      onMouseLeave={() => setHoveredIndex(null)}
      style={
        (translated && hoveredIndex === index) || (lemma_vals && lemma_vals.includes(trimmedWord))
          ? {
              textDecoration: "underline",
              textDecorationColor: underlineColour,
              textDecorationThickness: "2px",
            }
          : {}
      }
    >
      {hoveredIndex === index && (
        <div className="hovered-text">{translatedWord}</div>
      )}

      {word}
    </div>
  );
};

export default WordItem;
