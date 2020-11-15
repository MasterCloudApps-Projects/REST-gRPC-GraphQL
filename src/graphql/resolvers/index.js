const articleResolver = require('./article');
const clientResolver = require('./client');
const distanceResolver = require('./distance');

module.exports = {
    Query: {
        ...articleResolver.Query,
        ...clientResolver.Query,
        ...distanceResolver.Query
    },

    Mutation: {
        ...articleResolver.Mutation
    }
};
