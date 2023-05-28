import React from "react";
import { Link, useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

// TODO: Make external links internal (popup)
// TODO: show menu inline

const BookHeader = ({ bookId, bookTitle, handleDelete }) => {
  let navigate = useNavigate();

  let [anchorEl, setAnchorEl] = React.useState(null);
  let open = Boolean(anchorEl);
  let handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  let handleClose = () => {
    setAnchorEl(null);
  };

  let handleBack = () => {
    navigate("/"); // sends user back to homepage
  };

  return (
    <div className="book-header">
      <h3>
        <ArrowBackIosIcon onClick={handleBack} />
      </h3>
      {bookTitle}

      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? "long-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="long-menu"
        MenuListProps={{
          "aria-labelledby": "long-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: 48 * 4.5,
            width: "20ch",
          },
        }}
      >
        <MenuItem onClick={handleClose}>Progress</MenuItem>
        <Link to={`/book/${bookId}/${bookTitle}/translations`}>
          <MenuItem>Translations</MenuItem>
        </Link>
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
        <Link target="_blank" to="https://www.deepl.com/translator#fr/en">
          <MenuItem>DeepL</MenuItem>
        </Link>
        <Link target="_blank" to="https://www.wordreference.com/fren/">
          <MenuItem>WordReference</MenuItem>
        </Link>
      </Menu>
    </div>
  );
};

export default BookHeader;
