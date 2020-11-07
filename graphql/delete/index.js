/**
 * To create a new entry, run:

curl -v -H "Content-Type: application/json" \
    -d '{ "query": "mutation { createArticle(article: { title: \"This is my first post\", description: \"This is the beginning of a beautiful friendship\" }) { id } }" }' \
    http://localhost:4000/graphql

 * The above request will return the id of the newly created resource. To fetch the resource, you can run:

 curl -v -H "Content-Type: application/json" \
    -d '{ "query": "query { article(id: \"5fa5cb0c38137b23c1ac82c4\") { id, title } }" }' \
    http://localhost:4000/graphql

 * To remove it, let's exercise the new mutation `deleteArticle(articleId: ID!): Article`:

 curl -v -H "Content-Type: application/json" \
    -d '{ "query": "mutation { deleteArticle(articleId: \"5fa6d242bc92b1350046395d\" ) { id } }" }' \
    http://localhost:4000/graphql


 */

const express = require("express");
require("./mongoose.js");
var { graphqlHTTP } = require('express-graphql');
const graphqlSchema = require("./graphql/schema");
const graphqlResolvers = require("./graphql/resolvers");
const errorHandler = require("./errorhandler");

const app = express();

app.use(
    "/graphql",
    graphqlHTTP({
        schema: graphqlSchema,
        rootValue: graphqlResolvers,
        graphiql: true,
        customFormatErrorFn: errorHandler
    })
);

app.listen(4000, () => console.log("Server is running on localhost:4000"));
