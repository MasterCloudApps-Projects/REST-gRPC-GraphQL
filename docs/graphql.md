# GraphQL
Back in 2012, Facebook mobile developers only had a RESTful API to access resources, and able to create advanced queries using FQL (An SQL-Like language developed by Facebook to let API clients run their own queries). This technology didn't suit well their needs; they wanted an API technology that let them access the whole Facebook model, in a really simple way, and not thinking in terms of resources nor representations (only JSON is supported). Then GraphQL was born. Most comonly known as a query language, GraphQL is much more than that:

* **Query language** - Let client-side application run their own queries. It supports filtering, pagination, fields-selection, etc. Queries are just a string sent from the client to the server. Given the nature of the schema, graphql reduces the required number of requests.
* **Schema definition language** - There is no need to appeal to third-party technologies to define the domain model. The GraphQL Schema Language is also **strongly typed**.
* **A reference implementation** - The [`graphql-js` project][graphql-js].
* **An ecosystem** - Toghether with the spec, the language, and the referenece implementations, are some official tools, like [GraphiQL][] (an IDE and query runner), or [express-graphql][] (a middleware for express to create a GraphQL server).

These are the [Design Principles behind GraphQL][]:
* **Hierarchical**. Views in applications displays information hierarchically. GraphQL queries are hierarchical as well, to mimic the structure of the views. Unlike REST, which exposes _resources_, GraphQL promotes its **entity graph**.
* **Product-Centric**. It was born to solve the problems of the frontend developers.
* **Strong-typing**. This allows for validation, either with development tools or in the server.
* **Client-specified queries**. Thanks to the strongly-typed schema, servers expose their capabilities, and then clients decide what they exactly want.
* **Introspective**. The query language itlsef is able to ask a server about it's type system. This enables the promotion of tooling and shared libraries.

Among other thinks, this also [improves the evolvability][GraphQL Best Practices: versioning] of the API, as we can monitor which fields are actually being used/requested, which makes deprecation much easier.

## Adoption
GraphQL adoption has not stopped increasing ince its inception. [GitHub announcement][The GitHub GraphQL API] of their new GraphQL API clearly was a game changer: 60% of their database requests were because of their REST API: an hypermedia-based API often requieres several round-trips to fetch all the information needed ([dealing with under-fetching and over-fetching in REST](usage/method_get.md) is far from trivial). They had got several other concerns (they wanted type-safety, a better pagination strategy, automatic documentation from the code, etc.) Turned out GraphQL matched all their requirements.

However, [some people][You Might Not Need GraphQL] argue that most of the claimed advantajes of GraphQL over REST can actually be used on REST (sparse fieldsets, schema, query language, embedded resources, etc).

## GraphQL Query Language
Here we will just make a quick introduction to some concepts of the GraphQL Query Language. It support three different operations: `query`, `mutation` and `subscription`. In the following case we are running the `me` query, and selecting the field `name` from its result:

```
{
    me {
        name
    }
}
```

When the operation is of type `query`, the _operation type_ is optional. In case it was a `mutation` or a `subscription` it would be mandatory. In the following example we run a mutation setting a parameter `id`. Note the operation type:

```graphql
mutation {
    deleteArticle(id: 5) { title }
}
```

Each request can contain a batch of several operations of the same type. For example:

```graphql
mutation {
    deleteArticle(id: 5) { title }
    deleteComment(id: 50) { author { name } }
}
```

Additionally, we can name our operation to help monitoritation and debugging:

```graphql
mutation MyMutationName {
    deleteArticle(id: 5) { title }
    deleteComment(id: 50) { author { name } }
}
```

Finally, we can define variables

```graphql
mutation MyMutationName($articleId: ID!, $commentId: ID!) {
    deleteArticle(id: $articleId) { title }
    deleteComment(id: $commentId) { author { name } }
}
```

In this case, variables will be specified in its own JSON object:

```json
{
    "articleId": 5,
    "commentId": 50
}
```

This was just an introduction to the GraphQL syntax. In subsequent chapters we will explore each usage case.

## GraphQL over HTTP
Technically, GraphQL can run on top of any transport protocol. However, [the most common choice is HTTP][GraphQL in HTTP]. This leads to the following:

### HTTP URIs
Since GraphQL exploits the conceptual model of _entity graph_ to represent the state of a system, entities are not identifier by a URI. Instead, there is a single entry point (URI) to make requests to the API.

### HTTP Methods
Both `GET` and `POST` can be used. If using `GET`, the query will be sent as a JSON string in the `query` parameter, as in: `http://myapi/graphql?query={me{name}}`. Optional parameters `variable` and `operationName` can be used as well.

When using `POST`, an JSON object like this will be sent to the server:

```json
{
    "query": "...",
    "operationName": "...",
    "variables": {
        "myVariable": "someValue",
        ...
    }
}
```

Where `operationName` and `variables` are optional fields.

### HTTP Response
GraphQL only supports a single representation for their entities: `JSON`. Specifically, the response will be wrapped in a JSON object with two fields, `data` and `errors`:

```json
    "data": { ... },
    "errors": [ ... ]
}
```

### Implementations
Unlike REST (which is _just_ an architectural style), there are a lot of implementations of the official GraphQL spec, both for server and clients, and for every major programming language.

The most popular ones are JavaScript based:

* [express-graphql][] - GraphQL official middleware for [Express](https://expressjs.com/).
* [Apollo](https://www.apollographql.com/) - The industry-standard solution for GraphQL.

## Resources
* [GraphQL official webpage](https://graphql.org/)
* [GraphQL: A data query language](https://graphql.org/blog/graphql-a-query-language/), introducing GraphQL to the World.
* [GraphQL spec](http://spec.graphql.org)
* [GrapiQL IDE][GraphiQL]
* [graphql-js reference implementation][graphql-js]
* [express-graphql][]
* [GitHub Blog post: The GitHub GraphQL API][The GitHub GraphQL API]

[Design Principles behind GraphQL]: http://spec.graphql.org/draft/#sec-Overview
[graphql-js]: https://github.com/graphql/graphql-js
[GraphiQL]: https://github.com/graphql/graphiql
[express-graphql]: https://github.com/graphql/express-graphql
[The GitHub GraphQL API]: https://github.blog/2016-09-14-the-github-graphql-api/
[You Might Not Need GraphQL]: https://blog.runscope.com/posts/you-might-not-need-graphql
[GraphQL Best Practices: versioning]: https://graphql.org/learn/best-practices/#versioning
[GraphQL in HTTP]: https://graphql.org/learn/serving-over-http/
