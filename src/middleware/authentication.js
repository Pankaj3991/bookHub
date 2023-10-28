const Book = require("../database/models/book.js");
const Review = require("../database/models/reviews.js");
const { bookSchema, reviewSchema } = require("../database/validation/Schema.js");
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to add a book!");
        return res.redirect("/login");
    }
        next();
}

module.exports.savedRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = wrapAsync(async (req,res,next)=>{
    let {id} = req.params;
    let book = await Book.findById(id);
    if(!(book.publisher._id).equals(req.user._id)){
        req.flash("error","You are not owner of this book");
        return res.redirect(`/book/${id}`);
    }
    next(); 
})

module.exports.isReviewAuthor = wrapAsync(async (req,res,next)=>{
    let {id, reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!(review.postedBy._id).equals(req.user._id)){
        req.flash("error","You are not author of this review");
        return res.redirect(`/book/${id}`);
    }
    next(); 
})

module.exports.validateBook = (req, res, next) => {
    let { error } = bookSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, error);
    } else {
        next();
    }
}

module.exports.validateReviews = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, error);
    } else {
        next();
    }
}