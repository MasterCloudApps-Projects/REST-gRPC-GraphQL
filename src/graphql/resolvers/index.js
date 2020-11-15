const Article = require("../../models/article")
const Comment = require("../../models/comment")
const Client = require("../../models/client")

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

function assertUserLogIn(user) {
    if (user == undefined || user.username == undefined) {
        throw new Error("Access restricted. Please, provide a valid access token");
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
    },

    updateArticle: async ({id, article}) => {
        const previous = await Article.findById(id);
        await Article.replaceOne({ _id: id}, Object.assign(previous, article));
        return new GArticle(Object.assign(previous, article));
    },

    patchArticle: async ({id, title, description}) => {
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

    client: async ({dni}, context) => {
        assertUserLogIn(context.user);
        const client = await Client.findOne({dni});
        if (client) {
            return client;
        }
    },

    distance: ({from, to}) => ({from, to, km: 540})

};
