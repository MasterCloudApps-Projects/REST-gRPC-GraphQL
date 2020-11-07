const { buildSchema } = require("graphql");

module.exports = buildSchema(`
    type Article {
        id: ID!
        title: String!
        description: String!
    }

    input ArticleInput {
        title: String!
        description: String!
    }

    type Query {
        article(id: String!): Article!
    }

    type Mutation {
        createArticle(article:ArticleInput): Article
        deleteArticle(articleId: ID!): Article
    }

    schema {
        query: Query
        mutation: Mutation
    }
`);
