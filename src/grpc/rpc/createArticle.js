const pubsub = require("../../pubsub");
const Article = require("../../models/article");

module.exports = async function createArticle(call, callback) {
    const article = new Article(call.request.article);
    const newArticle = await article.save();
    pubsub.publishNewArticle(newArticle);
    callback(null, {
        id: newArticle.id,
        title: newArticle.title,
        description: newArticle.description,
        comments: []
    });
}
