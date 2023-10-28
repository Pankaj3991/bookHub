const Review = require("../database/models/reviews.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Book = require("../database/models/book.js");

module.exports.addReview = wrapAsync(async (req,res)=>{
    let {BookId} = req.params;
    const newReview = new Review(req.body.review);
    newReview.postedBy = req.user._id;
    const book = await Book.findById(BookId);
    await book.reviews.push(newReview);
    await newReview.save();
    await book.save();
    req.flash("success","New review created");
    res.redirect(`/book/${BookId}`);
})

module.exports.deleteReview = wrapAsync(async (req,res)=>{
    const {bookId,reviewId} = req.params;
    await Book.findByIdAndUpdate(bookId,{$pull:{reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review successfully deleted");
    res.redirect(`/book/${bookId}`);
})