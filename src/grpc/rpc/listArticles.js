const Article = require("../../models/article");

module.exports = async function listArticles(call, callback) {
    const getFromCondition = function(after) {
        if (after == undefined || after == "") {
            return {};
        }
        return {'_id': {'$gt': after}}
    }
    const getLimitValue = (limit) => Math.min(20, parseInt(limit)) || 10;

    let articles = await Article
        .find(getFromCondition(call.request.page_token))
        .limit(getLimitValue(call.request.size));
    const nextPageToken = articles.length ? articles[articles.length - 1].id : null;
    callback(
        null,
        {
            articles,
            next_page_token: nextPageToken,
        }
    )
}