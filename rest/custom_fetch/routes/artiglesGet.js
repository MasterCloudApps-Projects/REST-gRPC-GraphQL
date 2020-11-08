const Article = require('../models/article');

// This method generates the `Web Links` to be consumed by clients:
function getPaginationLinks(uri, offset, limit, total) {
    function buildLink(rel, newOffset, newLimit) {
        // FIXME: this localhost:4000 should be defined elsewhere. Maybe in the request context
        return `<http://localhost:4000${uri}?offset=${newOffset}&limit=${newLimit}>; rel="${rel}"`;
    }
    let links = [];
    if ((offset + limit) < total) {
        links.push(buildLink('next', offset + limit, limit));
    }
    links.push(buildLink('last', total - limit, limit));
    links.push(buildLink('first', 0, limit));
    if (offset > 0) {
        const prevLimit = limit + Math.min(0, offset - limit);
        links.push(buildLink('prev', offset - prevLimit, prevLimit));
    }
    return links;
}

module.exports = async (req, res) => {
    res.format({'application/json': async () => {
        // If undefined, we will limit to 10, and up to 20 will be accepted
        const limit = Math.min(20, parseInt(req.query.limit)) || 10;
        // If undefined, offset/cursor is 0
        const offset = parseInt(req.query.offset) || 0;
        let result = await Article.find().limit(limit).skip(offset);
        const length = await Article.countDocuments();
        res.set('Link', getPaginationLinks('/articles', offset, limit, length).join(', '))
        res.json(result.map(article => ({
            title: article.title,
            description: article.description
        })));
    }});
};
