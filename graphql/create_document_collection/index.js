/**
 * To create a new entry, run:

curl -v -H "Content-Type: application/json" \
    -d '{ "query": "mutation { createArticle(article: { title: \"This is my first post\", description: \"This is the beginning of a beautiful friendship\" }) { id } }" }' \
    http://localhost:4000/graphql

 * The above request will return a Location header. To fetch the entry created above, run (updating the identifier):
 */

const express = require("express");
require("./mongoose.js");
var { graphqlHTTP } = require('express-graphql');
const graphqlSchema = require("./graphql/schema");
const graphqlResolvers = require("./graphql/resolvers");

const app = express();

app.use(
    "/graphql",
    graphqlHTTP({
        schema: graphqlSchema,
        rootValue: graphqlResolvers,
        graphiql: true,
    })
);

app.listen(4000, () => console.log("Server is running on localhost:4000"));
