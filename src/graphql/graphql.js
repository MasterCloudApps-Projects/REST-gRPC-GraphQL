const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({req}) => {
        return {
            user: req.user
        }
    }
});

module.exports = function(app) {
    server.applyMiddleware({ app });
};
