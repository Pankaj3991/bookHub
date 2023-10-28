const express = require("express");
const {validateReviews, isLoggedIn, isReviewAuthor} = require("../middleware/authentication.js");
const { addReview,deleteReview } = require("../controllers/review");
const router = express.Router({mergeParams:true});

router.route("/:BookId")
    .post(isLoggedIn,validateReviews,addReview);

router.delete("/:bookId/:reviewId",isLoggedIn, isReviewAuthor,deleteReview);
module.exports = router;