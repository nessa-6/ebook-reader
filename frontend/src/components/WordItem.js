import React from "react";

const WordItem = ({
  index,
  hoveredIndex,
  handleTranslation,
  word,
  trimmedWord,
  noContractionsWord,
  translated,
  lemma_dict,
  translatedWord,
  setHoveredIndex,
  underlineColour,
}) => {
  let lemma_vals = null
  let underlineWord = function () {
    if (lemma_dict) {
      lemma_vals = Object.values(lemma_dict)[0];
      if (lemma_vals) {
        if (!Array.isArray(lemma_vals)) {
          lemma_vals = [lemma_vals]
        }
        if (lemma_vals.includes(noContractionsWord) && noContractionsWord) {
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    } else {
      return false
    }
  }

  return (
    <div
      key={index}
      className={hoveredIndex === index ? "clicked-word" : "word"}
      onClick={(e) => handleTranslation(e, trimmedWord, index)}
      onMouseLeave={() => setHoveredIndex(null)}
      style={
        (translated && hoveredIndex === index) || (underlineWord())
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
