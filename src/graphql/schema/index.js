const { gql } = require('apollo-server-express');

module.exports = gql`
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

    type Client {
        id: ID!
        dni: String!
        iban: String!
    }

    type Distance {
        from: String!
        to: String!
        km: Int!
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
        client(dni: String!): Client!
        distance(from: String!, to: String!): Distance!
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
`;
