const { exists } = require("../../models/article");
const Article = require("../../models/article")

module.exports = {
    article: async (params) => {
        const article = await Article.findById(params.id);
        return {
            ...article._doc,
            id: article.id,
            createdAt: new Date(article._doc.createdAt).toISOString(),
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
};
