const Article = require("../../models/article");
const Comment = require("../../models/comment");
var grpc = require('@grpc/grpc-js');

module.exports = async function getArticle(call, callback) {
    const id = call.request.id;
    const article = await Article.findById(id);
    let response = null;
    let error = null;
    const comments = await Comment.find({ article: id })
    if (article) {
        response = {
            id,
            title: article.title,
            description: article.description,
            comments: comments.map(({author, text}) => ({author, text}))
        }
    } else {
        return callback({
            code: grpc.status.NOT_FOUND,
            message: `Article ${id} not found`,
        });
    }
    callback(
        error,
        response
    )

}