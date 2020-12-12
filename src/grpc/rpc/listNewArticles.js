const pubsub = require("../../pubsub");

module.exports = async function listNewArticles(call) {
    for await (const article of pubsub.getNewArticleAsyncIterator()) {
        call.write(article.newArticle);
    }
}
