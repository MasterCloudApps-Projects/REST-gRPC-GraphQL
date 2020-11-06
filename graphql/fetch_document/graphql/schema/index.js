const { buildSchema } = require("graphql");

module.exports = buildSchema(`
    type Query {
        article(id: Int!): String
    }
`);
