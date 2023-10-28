const Connection = require("../config/config.js");
const initData = require("./data.js");
const Book = require("../models/book.js");
Connection();



const initDB = async () => {
    await Book.deleteMany({});
    await Book.insertMany(initData.data);
    console.log("data was initialized");
  };
  
  initDB();