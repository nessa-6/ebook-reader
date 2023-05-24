import React from "react";
import { Link } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

const BookHeader = ({ handleBack, book, bookId, handleDelete }) => {
  let [anchorEl, setAnchorEl] = React.useState(null);
  let open = Boolean(anchorEl);
  let handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  let handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="book-header">
    <h3>
      <ArrowBackIosIcon onClick={handleBack} />
    </h3>
    {book?.title}

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
      <Link to={`/book/${bookId}/translations`}>
        <MenuItem>Translations</MenuItem>
      </Link>
      <MenuItem onClick={handleDelete}>
        <DeleteIcon />
      </MenuItem>
    </Menu>
  </div>
  );
};

export default BookHeader;
