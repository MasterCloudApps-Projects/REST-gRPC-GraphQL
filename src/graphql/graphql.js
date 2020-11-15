const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({req, connection}) => {
        if (connection) {
            return connection.context;
        }
        return {
            user: req.user
        }
    }
});

module.exports = function(app, httpServer) {
    server.applyMiddleware({ app });
    server.installSubscriptionHandlers(httpServer);
};
