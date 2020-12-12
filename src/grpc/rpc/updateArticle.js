const Article = require("../../models/article");

module.exports = async function updateArticle(call, callback) {
    const id = call.request.article.id;
    const previous = await Article.findById(id);
    const updatedArticle = Object.assign(previous, call.request.article);
    await Article.replaceOne({ _id: id}, updatedArticle);
    callback(null, updatedArticle);
}
