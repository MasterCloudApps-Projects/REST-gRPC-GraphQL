const { buildSchema } = require("graphql");

module.exports = buildSchema(`
    type Article {
        id: ID!
        title: String!
        description: String!
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
    }

    schema {
        query: Query
        mutation: Mutation
    }
`);
