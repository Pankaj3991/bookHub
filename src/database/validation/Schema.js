const joi = require("joi");
module.exports.bookSchema = joi.object({
    book :joi.object({
        title:joi.string().required(),
        contact:joi.number().required(),
        price:joi.number().required(),
        image:joi.string().allow("",null)
    }).required()
});

module.exports.reviewSchema = joi.object({
    review : joi.object({
        rating:joi.number().required().min(1).max(5),
        comment: joi.string().required(),
    }).required()
});