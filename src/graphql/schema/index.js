const { buildSchema } = require("graphql");

module.exports = buildSchema(`
    type Comment {
        author: String!
        text: String!
    }

    type Article {
        id: ID!
        title: String!
        description: String!
        comments: [Comment]!
    }

    type Edge {
        cursor: String!
        node: Article!
    }

    type PageInfo {
        endCursor: String
        hasNextPage: Boolean!
    }

    type ArticlesPayload {
        edges: [Edge]!
        pageInfo: PageInfo!
        totalCount: Int!
    }

    input ArticleInput {
        title: String!
        description: String!
    }

    type Query {
        article(id: String!): Article!
        articles(after: String, first: Int): ArticlesPayload
    }

    type Mutation {
        createArticle(article:ArticleInput): Article
        deleteArticle(id: ID!): Article
        updateArticle(id: ID!, article:ArticleInput): Article
        patchArticle(id: ID!, title:String, description:String): Article
    }

    schema {
        query: Query
        mutation: Mutation
    }
`);
