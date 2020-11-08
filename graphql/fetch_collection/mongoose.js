const mongoose = require("mongoose");
const createArticles = require('./db');

//Set up default mongoose connection
const uri = `mongodb://${process.env.MONGO_HOST}/${process.env.MONGO_DB}?retryWrites=true&w=majority`
const options = { useNewUrlParser: true, useUnifiedTopology: true }
mongoose
    .connect(uri, options)
    .then(_ => createArticles(100))
    .catch(error => {
        throw error
    });
