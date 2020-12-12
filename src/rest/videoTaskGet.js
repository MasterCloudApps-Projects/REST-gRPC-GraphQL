const VideoTask = require('../models/videoTask');

module.exports = async (req, res) => {
    try {
        const videoTaskFetched = await VideoTask.findById(req.params.id);
        if (videoTaskFetched) {
            const response = {
                status: videoTaskFetched.status
            };
            if (videoTaskFetched.status == 'done') {
                res.location('/videos/' + videoTaskFetched.videoId);
                res.status(303);
            }
            res.format({'application/json': () => res.json(response)});
        } else {
            res.sendStatus(404);
        }
    } catch (error) {
        if (error instanceof CastError) {
            res.sendStatus(400);
        } else {
            console.log(error);
            res.sendStatus(500);
        }
    }
};
