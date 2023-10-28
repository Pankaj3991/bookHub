const wrapAsync = require("../utils/wrapAsync.js");
const Book = require("../database/models/book.js");

module.exports.homePage = wrapAsync(async (req,res)=>{
    const Books = await Book.find({});
    res.render("pages/home.ejs",{Books});
})

module.exports.renderAddBook = wrapAsync(async (req,res)=>{
    res.render("pages/addBook.ejs");
})

module.exports.addBook = wrapAsync(async (req,res)=>{
    let url = req.file.path;
    let filename = req.file.filename;
    const newBook = new Book(req.body.book);
    newBook.publisher = req.user._id;
    newBook.image = {url,filename};
    await newBook.save();
    req.flash("success", "new book added");
    res.redirect("/");
})

module.exports.showPage = wrapAsync(async (req,res)=>{
    let {id} = req.params;
    const book = await Book.findById(id).populate({path:"reviews",populate:{path:"postedBy"}}).
    populate("publisher");
    if (!book) {
        req.flash("error", "Book you requested doesn't exist");
        res.redirect("/");
    }
    res.render("pages/show.ejs",{book});
})

module.exports.deletePage = wrapAsync(async (req,res)=>{
    let {id} = req.params;
    const deletedBook = await Book.findByIdAndDelete(id);
    req.flash("success", "Book successfully deleted");
    res.redirect("/");
})

module.exports.renderEdit = wrapAsync(async (req,res)=>{
    let {id} = req.params;
    const book = await Book.findById(id).populate("publisher");
    if (!book) {
        req.flash("error", "Book you requested doesn't exist");
        res.redirect("/");
    } else {
        res.render("pages/edit.ejs", { book });
    }
})

module.exports.editBook = wrapAsync(async (req,res)=>{
    let {id} = req.params;
    await Book.findByIdAndUpdate(id, { ...req.body.book });
    req.flash("success", "book successfully updated");
    res.redirect(`/book/${id}`);
})