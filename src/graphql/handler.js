var { graphqlHTTP } = require('express-graphql');
const graphqlSchema = require("./schema");
const graphqlResolvers = require("./resolvers");

module.exports = graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolvers,
    graphiql: true,
});
