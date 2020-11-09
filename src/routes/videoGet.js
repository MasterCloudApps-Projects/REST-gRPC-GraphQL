var mongoose = require('mongoose');
const Video = require('../models/video');
var { CastError } = mongoose.Error;

// Return 200 when found or 404 when not found:
module.exports = async (req, res) => {
    try {
        const videoFetched = await Video.findById(req.params.id);
        if (videoFetched) {
            res.format({
                'application/json': () => res.json({
                    title: videoFetched.title,
                    plot: videoFetched.plot
                })
            });
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
}