var mongoose = require('mongoose');
const Comment = require('../models/comment');
const Article = require('../models/article');
var { CastError } = mongoose.Error;

async function getCommentsFromArticle(id) {
    const comments = await Comment.find({ article: id });
    return comments.map(comment => ({
        id: comment._id,
        author: comment.author,
        text: comment.text
    }));
};

module.exports = async (req, res) => {
    const fields = req.query.fields || ['title', 'description'];
    try {
        const articleFetched = await Article.findById(req.params.id);
        if (articleFetched) {
            let response = Object.assign(
                {},
                fields.includes('id') ? {title: articleFetched.id} : null,
                fields.includes('createdAt') ? {createdAt: new Date(articleFetched.createdAt).toISOString() } : null,
                fields.includes('updatedAt') ? {updatedAt: new Date(articleFetched.updatedAt).toISOString() } : null,
                fields.includes('title') ? {title: articleFetched.title} : null,
                fields.includes('description') ? {description: articleFetched.description} : null,
                fields.includes('comments') ? {comments: await getCommentsFromArticle(req.params.id)} : null,
            );
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
