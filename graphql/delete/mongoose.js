const mongoose = require("mongoose");

//Set up default mongoose connection
const uri = `mongodb://${process.env.MONGO_HOST}/${process.env.MONGO_DB}?retryWrites=true&w=majority`
const options = { useNewUrlParser: true, useUnifiedTopology: true }
mongoose
    .connect(uri, options)
    .catch(error => {
        throw error
    });
