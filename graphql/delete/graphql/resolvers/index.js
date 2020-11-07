const Article = require("../../models/article");

class InvalidInputError extends Error {
    constructor(message, code) {
        super(message);
        this.name = 'InvalidInput';
        this.code = code; // This is a made up code, completely unrelated to HTTP codes
    }
}

module.exports = {
    article: async (params) => {
        const article = await Article.findById(params.id);
        if (!article) {
            throw new InvalidInputError(`Item not found ${params.id}`, 20);
        }
        return {
            ...article._doc,
            id: article.id,
        };
    },

    createArticle: async args => {
        const article = new Article(args.article);
        const newArticle = await article.save();
        return {
            ...newArticle._doc,
            id: newArticle.id
        };
    },

    deleteArticle: async (params) => {
        const deletedArticle = await Article.findByIdAndDelete(params.articleId);
        if (!deletedArticle) {
            throw new InvalidInputError(`Item not found ${params.articleId}`, 200);
        }
        return {
            ...deletedArticle._doc,
            id: deletedArticle.id
        }
    }
};
