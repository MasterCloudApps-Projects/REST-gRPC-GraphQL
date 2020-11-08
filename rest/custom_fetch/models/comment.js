const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const commentSchema = new Schema(
    {
        author: {
            type: String,
            required: true,
        },
        text: {
            type: String,
            required: true,
        },
        article: {
            type: Schema.Types.ObjectId,
            ref: 'Article'
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Comment', commentSchema);
