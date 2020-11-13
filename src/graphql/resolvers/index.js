const Article = require("../../models/article")
const Comment = require("../../models/comment")

class GArticle {
    constructor(row) {
        this.row = row;
        this.id = row.id;
        this.title = row.title;
        this.description = row.description;
    }

    async comments() {
        // N+1 problem here!
        return await Comment.find({ article: this.id })
    }
}

module.exports = {
    article: async (params) => {
        const article = await Article.findById(params.id);
        if (article) {
            return new GArticle(article);
        }
    },

    createArticle: async args => {
        const article = new Article(args.article);
        const newArticle = await article.save();
        return new GArticle(newArticle);
    },

    articles: async (params) => {
        const getFromCondition = function(after) {
            if (after == undefined) {
                return {};
            }
            return {'_id': {'$gt': after}}
        }

        // If undefined, we will limit to 10, and up to 20 will be accepted
        const getLimitValue = (limit) => Math.min(20, parseInt(limit)) || 10;
        const getHasNextPage = async (results) => (results.length) ?
            !!(await Article.find(getFromCondition(results[results.length - 1])).limit(1)).length :
            false;
        let articles = await Article
            .find(getFromCondition(params.after))
            .limit(getLimitValue(params.first));
        
        return {
            totalCount: await Article.countDocuments(),
            pageInfo: {
                hasNextPage: await getHasNextPage(articles),
                endCursor: articles.length ? articles[articles.length - 1].id : null
            },
            edges: articles.map(article => ({
                cursor: article.id,
                node: new GArticle(article)
            }))
        };
    },

    deleteArticle: async (params) => {
        const deletedArticle = await Article.findByIdAndDelete(params.id);
        if (!deletedArticle) {
            throw new InvalidInputError(`Item not found ${params.id}`, 200);
        }
        return {
            ...deletedArticle._doc,
            id: deletedArticle.id
        }
    }
};
