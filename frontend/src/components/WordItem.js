import React from "react";

const WordItem = ({
  index,
  hoveredIndex,
  handleTranslation,
  word,
  trimmedWord,
  lemma,
  translated,
  translations,
  translatedWord,
  setHoveredIndex,
  underlineColour,
}) => {
  return (
    <div
      key={index}
      className={hoveredIndex === index ? "clicked-word" : "word"}
      onClick={(e) => handleTranslation(e, trimmedWord, index)}
      onMouseLeave={() => setHoveredIndex(null)}
      style={
        (translated && hoveredIndex === index) ||
        translations.includes(lemma)
          ? {
              textDecoration: "underline",
              textDecorationColor: underlineColour,
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
