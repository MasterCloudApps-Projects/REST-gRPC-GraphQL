var mongoose = require('mongoose');
const VideoTask = require('../models/videoTask');
const Video = require('../models/video');
var { ValidationError } = mongoose.Error;

async function slowDeferredOperation(videoTaskId) {
    const time = 15000;
    setTimeout(async videoTaskId => {
        const videoTask = await VideoTask.findById(videoTaskId);
        const video = new Video({
            title: videoTask.video.title,
            plot: videoTask.video.plot
        });
        const videSaved = await video.save();
        await VideoTask.updateOne({ _id: videoTaskId}, { status: 'done', video: null, videoId: videSaved._id });
    }, time, videoTaskId);
}

// Factory method to register a new async `task` that will create a new resource of type `video`:
module.exports = async (req, res) => {
    const video = req.body;

    // A new task is registered
    let videoTask = new VideoTask({
        video: video,
        status: 'pending'
    });
    try {
        const newVideoTask = await videoTask.save();
        await slowDeferredOperation(newVideoTask.id);

        const identifier = '/videos/tasks/' + newVideoTask.id;
        res.status(202);
        res.set('Content-Location', identifier);
        res.format({
            'application/json': () => res.json({'status': 'pending'})
        });
    } catch (error) {
        if (error instanceof ValidationError) {
            res.sendStatus(400);
        } else {
            console.log(error);
            res.sendStatus(500);
        }
    }
};
