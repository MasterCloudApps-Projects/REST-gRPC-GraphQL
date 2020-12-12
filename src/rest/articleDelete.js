const Article = require('../models/article');

module.exports = async (req, res) => {
    try {
        await Article.findByIdAndDelete(req.params.id);
        res.sendStatus(204);
    } catch (error) {
        res.sendStatus(500);
    }
};
