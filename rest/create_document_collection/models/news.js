let mongoose = require('mongoose');

//schema
let Schema = mongoose.Schema;
const newsSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
});

// Export News Model
const News = module.exports = mongoose.model('News', newsSchema);
module.exports.get = function (callback, limit) {
    News.find(callback).limit(limit); 
}
