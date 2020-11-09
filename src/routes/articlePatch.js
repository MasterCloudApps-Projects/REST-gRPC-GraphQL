const Article = require('../models/article');
const applyOperation = require('fast-json-patch').applyOperation;

module.exports = async (req, res) => {
    const patch = req.body;
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

            // The patch is applied here. We are applying a single change. We could accept an array
            // of changes and apply them sequencially.
            await Article.replaceOne({ _id: code}, applyOperation(previous, patch).newDocument);
            const updated = await Article.findById(code);
            res.status(200)
            .location(identifier)
            .set('Content-Location', identifier)
            .format({
                'application/json': async () => res.json({
                    title: updated.title,
                    description: updated.description
                })
            })
        }
    }
};
