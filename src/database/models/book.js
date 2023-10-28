const mongoose = require("mongoose");
const User = require("./user.js");
const Review = require("./reviews.js");
const bookSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    }, 
    image:{
        filename:String,
        url:{
            type:String,
            default:"https://m.media-amazon.com/images/I/91kt9WLTE+L._SL1500_.jpg"
        }
    },
    price:{
        type: Number,   
    },
    contact: Number,
    publisher:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    },
    reviews:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Review',
    }]
});

module.exports = mongoose.model("Book",bookSchema);