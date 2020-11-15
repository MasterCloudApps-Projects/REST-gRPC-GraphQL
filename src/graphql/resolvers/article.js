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
    Query: {
        article: async (_, {id}) => {
            const article = await Article.findById(id);
            if (article) {
                return new GArticle(article);
            }
        },

        articles: async (_, {after, first}) => {
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
                .find(getFromCondition(after))
                .limit(getLimitValue(first));

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
    },

    Mutation: {
        createArticle: async (_, args) => {
            const article = new Article(args.article);
            const newArticle = await article.save();
            return new GArticle(newArticle);
        },

        deleteArticle: async (_, {id}) => {
            const deletedArticle = await Article.findByIdAndDelete(id);
            if (!deletedArticle) {
                throw new Error(`Item not found ${id}`, 200);
            }
            return {
                ...deletedArticle._doc,
                id: deletedArticle.id
            }
        },

        updateArticle: async (_, {id, article}) => {
            const previous = await Article.findById(id);
            await Article.replaceOne({ _id: id}, Object.assign(previous, article));
            return new GArticle(Object.assign(previous, article));
        },

        patchArticle: async (_, {id, title, description}) => {
            const previous = await Article.findById(id);
            if (title !== undefined) {
                previous.title = title;
            }
            if (description !== undefined) {
                previous.description = description;
            }
            await Article.replaceOne({ _id: id}, previous);
            return new GArticle(previous);
        },
    }
};
