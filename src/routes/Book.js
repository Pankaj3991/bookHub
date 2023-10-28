const express = require("express");
const router = express.Router();
const { validateBook } = require("../middleware/authentication.js");
const {isLoggedIn,isOwner,validateListing} = require("../middleware/authentication.js");
const { homePage, showPage, editBook,
    renderEdit, deletePage, renderAddBook, addBook } = require("../controllers/Book.js");

const multer = require("multer");
const { storage } = require("../database/config/cloudConfig.js");
const upload = multer({ storage });

// router.route("/")
//     .get(homePage);

router.route("/new")
    .get(isLoggedIn,renderAddBook)
    .post(isLoggedIn,
        upload.single('book[image]'),
         addBook);

router.route("/:id/edit")
    .get(isLoggedIn, isOwner,renderEdit)
    .put(isLoggedIn, isOwner, validateBook, editBook);

router.route("/:id")
    .get(showPage)
    .delete(isLoggedIn, isOwner,deletePage);

module.exports = router;