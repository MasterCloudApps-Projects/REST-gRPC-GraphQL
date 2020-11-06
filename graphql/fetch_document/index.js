/**
 * To fetch an article:

curl -v -H "Content-Type: application/json" \
    -d '{ "query": "query { article(id: 5) }" }' \
    http://localhost:4000/graphql

 * The above request will return the article whose id is `5`:

{
    "data": {
        "article": "Article 5"
    }
}

*/


const express = require("express");
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
