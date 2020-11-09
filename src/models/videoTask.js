const mongoose = require('mongoose');
const Video = require('./video');

const Schema = mongoose.Schema;

const videoTaskSchema = new Schema(
    {
        video: {
            type: Video.schema,
            required: false,
        },
        videoId: {
            type: mongoose.Types.ObjectId,
            ref: 'Video',
            required: false
        },
        status: {
            type: String,
            required: true,
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('VideoTask', videoTaskSchema);
