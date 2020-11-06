const Article = require("../../models/article")

module.exports = {
    articles: async () => {
        const articlesFetched = await Article.find();
        return articlesFetched.map(article => {
            return {
                ...article._doc,
                _id: article.id,
                createdAt: new Date(article._doc.createdAt).toISOString(),
            }
        });
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
