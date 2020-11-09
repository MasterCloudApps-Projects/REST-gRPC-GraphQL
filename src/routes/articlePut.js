const Article = require('../models/article');

module.exports = async (req, res) => {
    const article = req.body;
    const code = req.params.id;
    const identifier = '/articles/' + code;
    const requestCondition = req.get('If-Unmodified-Since');
    const previous = await Article.findById(code);
    if (!requestCondition) {
        if (previous) {
            // The resource exists, but the request lacks of request conditions. Forbidden:
            res.sendStatus(403);
        } else {
            // The resource does no exist. `Post` should be used to create a new article
            res.sendStatus(404);
        }
    } else {
        requestConditionDate = new Date(requestCondition);
        if (!previous || requestConditionDate.toUTCString() !== previous.updatedAt.toUTCString()) {
            // Invalid preconditions:
            res.sendStatus(412);
        } else {
            // Preconditions met. Resource updated:

            // The resource is replaced here:
            await Article.replaceOne({ _id: code}, Object.assign(previous, article));
            res.status(200)
                .location(identifier)
                .set('Content-Location', identifier)
                .format({
                    'application/json': () => res.json({
                        title: article.title,
                        description: article.description
                    })
                });
        }
    }
};
