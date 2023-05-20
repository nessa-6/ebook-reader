import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { Link, useNavigate } from "react-router-dom";
import ListItem from "../components/ListItem";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const BookPage = () => {
  let params = useParams();
  let history = useNavigate();
  let bookId = params.id;
  let [book, setBook] = useState(null); // default value is null

  // adding dependencies prevents infinite loop
  useEffect(() => {
    let getBook = async () => {
      let response = await fetch(`/main/library/${bookId}/`); // backticks allow dynamic parameters
      let data = await response.json();
      // data is dict with fields id, transaltions, title, body, last_read
      // console.log(data);

      setBook(data);
    };
    getBook();
  }, [bookId]);

  let handleSubmit = () => {
    history("/"); // sends user back to homepage
  };

  let [anchorEl, setAnchorEl] = React.useState(null);
  let open = Boolean(anchorEl);
  let handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  let handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="book">
      <div className="book-header">
        <h3>
          <ArrowBackIosIcon onClick={handleSubmit} />
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
        </Menu>
      </div>
      <p className="chapter">{book?.body}</p>
    </div>
  );
};

export default BookPage;

