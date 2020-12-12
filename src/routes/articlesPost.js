var mongoose = require('mongoose');
const Article = require('../models/article');
var { ValidationError } = mongoose.Error;
const pubsub = require("../pubsub");

module.exports = async (req, res) => {
    let article = new Article(req.body);
    try {
        const newArticle = await article.save();
        pubsub.publishNewArticle(newArticle);
        const identifier = '/articles/' + newArticle._id;
        res.location(identifier);
        res.status(201);
        res.set('Content-Location', identifier);
        res.format({
            'application/json': () => res.json({
                title: article.title,
                description: article.description
            })
        });
    } catch (error) {
        if (error instanceof ValidationError) {
            res.sendStatus(400);
        } else {
            res.sendStatus(500);
        }
    }
};
