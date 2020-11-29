# Standard method: get
Reading a document, the most basic operation we can run on a resource, has also a lot of differences between API Styles.

## Simple read

Given an identifier, an API needs to allow their consumers to fetch the resource associated to that identifier. Let's see the foundations of resources fetching in each API style.

### REST
To fetch a single document resource in a _RESTful Web Service_, we first need to consider two things:

* Which HTTP method is the more apropriate.
* How we identify the resource.

A fetching does not have side effects, so it is both a _safe_ and an _idempotent_ operation. Besides, the underneath semantic matches that of `GET`. So for this we will use `GET`.

REST identifiers are _opaque_, so technically this is a perfectly valid identifier for a document of a product:

```/33b27e35-8f1a-4e05-8c4a-e36a90cffd9b```

However, if we want to stick to the most commonly used name standard, we will use something like this instead:

```/products/12```

Putting all this together, to fetch a resource we will just invoke the `GET` method on that resource:

```
GET /products/12

{
    "name": "Digital clock",
    "price": 12.5
}
```

### GraphQL
In GraphQL, we have the operation _query_ available to read resources. Unlike REST, where the URI represents the resource, in GraphQL we use a single entry point accepting a number of operations. A query operation can optionally accept arguments. Here a query named `product`, that accepts a single mandatory `String` argument named `id`, returns an element of type `Product`:

```graphql
type Query {
    product(id: String!): Product!
}
```

Elsewhere, in the GraphQL schema, the `Product` should be defined, as in:

```graphql
type Product {
    id: String!
    title: String!
    price: Int!
}
```

The server implementation will have a resolver function.

Finally, to invoke this query, the client will use:

```graphql
query GetProduct {
    product(id: "12") {
        name
        price
    }
}
```

Here, the client code is defining an operation of type `query`, using `GetProduct` as the _operation name_, which will invoke the remote query `product`, setting 12 as the value of the `id` parameter. Finally, the client app is specifying all the Product fields it is interested in.

### gRPC
In gRPC, a single [`Get` method](https://cloud.google.com/apis/design/standard_methods#get) will be defined. This will accept an request object to specify which resource to fetch:

```proto
rpc GetArticle(GetArticleRequest) returns (Article);

message GetArticleRequest {
    string id = 1;
}
```

## Representation
A resource might be represented in a variety of forms. For example, a product can be represented as a JSON, as an XML object, as a text description readable for humans, or even as a PDF as it happens with the data sheets of electronic components. Let's see how each API style deals with this.

### REST
HTTP provides native support for _Content Negotiation_. This is the process to selected the apropriate representation for a resource. It can be [Server-Driven Negotiation][] or [Agent-Driven Negotiation][]

#### Server-Driven Negotiation
Clients can use HTTP to tell the server about their preferences. Then the server uses their choices to select a representation. Please note, there is no standard algorithm for this.

* [`Accept`][]: to specify a weighted list of the accepted media types, as in `Accept: text/html, application/xhtml+xml, application/xml;q=0.9, */*;q=0.8`.
* [`Accept-Charset`][]: characters encodings accepted, as in `Accept-Charset: utf-8, iso-8859-1;q=0.5`.
* [`Accept-Language`][]: specifies the accepted languages. `Accept-Language: fr-CH, fr;q=0.9, en;q=0.8, de;q=0.7, *;q=0.5`.
* [`Accept-Encoding`][]: compression algorithms accepted. `Accept-Encoding: deflate, gzip;q=1.0, *;q=0.5`.

Servers will return the selected values, as well as a [`Vary`][] header to tell a cache whether a new request is needed or not.

#### Agent-Driven Negotiation
Sometimes, it is useful to let the user agent (manually or through a script) selected the desired representation. And even though HTTP includes some important selection features (type, charset, language, encoding...), it still lacks of many other useful representations, for example, currency unit or distance unit.

For all of the above, the _Agent-Driven Negociation_ was defined. In this case, the server will return a `300 - Multiple Choices` with a list of URIs for each representation. Note there is no standarized way to return the list of possible choices. Sometimes, subdomains, query parameters or URI extensions are used as a workaround.

#### Conteng-Negotiation in REST
REST leverages this featore to allow client applications negotiate the specific representation they are interested in. The requested Media Type will be returned as long as the server supports it.

> Most of the time, the resources will be represented using a meta-language, either in XML, JSON or YAML. Some people argue that this feature of REST is not that useful, since most modern programming languages can easily handle all those formats.

To negotiate the representation of a resource, the client may suggest its preference to the server using the `Accept` header, as in `Accept: application/json, text/plain, */*;q=0.8`.

### GraphQL
GraphQL does not have support to negotiate the representation of a resource. Instead, JSON is always used.

### gRPC
Even though gRPC runs on top of HTTP/2, and [can be used with any data representation (Protobuf, XML, JSON or Thrift)](https://grpc.io/faq/#can-i-use-grpc-with-my-favorite-data-format-json-protobuf-thrift-xml-), it does not support Content Negotiation out of the box.

## Custom fetching
Sometimes, the _shape_ of the returned representation does not match the requirements of the client application. This might be because of:

* **over-fetching** - The response contains more than needed. This leads to inefficient usage resources: both in the database and in the network usage.
* **under-fetching** - The response is not complete enough. Again, this leads to an inefficient usage of resources: subsequent requests will be done in order to fetch the missing data.

### REST
In REST, a naive way to address this would be defining a couple of _schemas_ for a resource representation. One could for example represent the _basic fields_, whereas other might represent the _extra fields_. Then, a client application could rely on content negotiation.

#### Sparse Fieldsets
When content negotiation is not enough, sparse fieldsets can be use. This technique aims to reduce the load on the backend and in the network by selecting the specific fields of the representation of a resource. By default, the _full representation_ will be returned. Clients are also able to specify which fields they are insterested in:

```
GET /resources?fields[]=field1&fields[]=field2
```

#### Embedded Resources
Some resources contain relations to other resources. For example, a _blog post_ might contain a relation to a _user_ and to a _collection of comments_. The default JSON representation of a blog post might not contain those related resources, thus forcing REST clients to run new queries to the API. In order to avoid this, some APIs let users auto-load embedded resources.

For example, the following request might return the blog post #12 along with its author and all its comments:

```
GET /posts/12?embed[]=comments&embed[]=author
```

Note that this technique can be use together with Sparse Fieldsets, so that a client app is allowed to specify not just the embedded resources but also the fields of those resouces. For example, the command above can be updated to select only the `name` field from the author:

```
GET /posts/12?embed[]=comments&embed[]=author.name
```

#### Real World Examples
These techniques has a wide adoption:

* [Google Tasks API][Partial response in Google Tasks API] recommends using _partial responses_ to improve the performance.
* JSON:API specification has a section about [Sparse Fieldsets][JSON:API Sparse Fieldsets].
* [OData][OData: Querying] takes this concept to the next level and has spec really close to a query language.

### GraphQL
GraphQL is basically a query language which allows third-parties to accurately select the shape of the data they are interested in. Let's supose a movie catalog which allows us to fetch specific movies. Each movie contains scalar fields, like `title`, `plot` or `year`, and typed fields, like `director` or `actors`, which is an array of actors.

```graphql
type Person {
    id: ID!
    name: String!
    gender: Gender!
}
enum Gender {
    MALE
    FEMALE
    NON_BINARY
}
type Movie {
    id: ID!
    title: String!
    plot: String!
    year: Int!
    director: Person!
    actors: [Person!]
}
type Query {
    movie(id: ID!): Movie!
}
```

A query must contain only scalar fields. So to fetch the `title` and `year` of a certain movie, we can run this query:

```graphql
query GetMovie {
    movie(id: "ID1") {
        title
        year
    }
}
```

The returned result will mimic the shape of the query, as in:

```json
{
    "data": {
        "movie": {
            "title": "The Fellowship of the Ring",
            "year": 2001
        }
    }
}
```

Selecting an embedded field is just as easy:

```graphql
query GetMovie {
    movie(id: "ID1") {
        title
        year
        director {
            name
        }
        actors {
            name
        }
    }
}
```

Which will return something like:

```json
{
    "data": {
        "movie": {
            "title": "The Fellowship of the Ring",
            "year": 2001,
            "director": {
                "name": "Peter Jackson"
            },
            "actors": [
                {
                    "name": "Elijah Wood"
                },
                {
                    "name": "Ian McKellen"
                },
                {
                    "name": "Orlando Bloom"
                }
            ]
        }
    }
}
```

Also note that GraphQL allows users to run several queries at once:

```graphql
query GetTwoMovie {
    firstMovie: movie(id: "ID1") {
        title
    }
    secondMovie: movie(id: "ID2") {
        title
    }
}
```

Note that each query has been prefixed with an alias to prevent them from clashing:

```json
{
    "data": {
        "firstMovie": {
            "title": "The Fellowship of the Ring"
        },
        "secondMovie": {
            "title": "The Two Towers"
        }
    }
}
```

Although GraphQL is an incredible powerful query language, it does not allow to change the _level of fields_. For example, we cannot fetch the director name in the root element of a movie to fetch something like:

```json
{
    "data": {
        "movie": {
            "title": "The Fellowship of the Ring",
            "directorName": "Peter Jackson"
        }
    }
}
```

There are some proposals to workaround this, like [GraphQL Leveler][].

### gRPC
Similar to JSON:API Sparse Fieldsets or fields selections of GraphQL, [`FieldMask` from Google](https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#fieldmask) can be used to fetch a [partial response](https://cloud.google.com/apis/design/design_patterns#partial_response) from a projection. Let's consider the following projection:

```
f {
  a : 22
  b {
    d : 1
    x : 2
  }
  y : 13
}
z: 8
```

`FieldMask` let express a list of paths to specify the fields a requested is interested in. For example:

```
paths: "f.a"
paths: "f.b.d"
```

After applying these paths, we will get:

```
f {
  a : 22
  b {
    d : 1
  }
}
```

Additionally, the [Resource View](https://cloud.google.com/apis/design/design_patterns#resource_view) pattern to select a specific view of a resource. For example, we might have two views, _basic_ and _full_, for a resource. Then the request object will specify which particular view it will use:

```proto
service Blog {
    rpc ListArticles(ListArticlesRequest) return (ListArticlesResponse);
}

enum ArticleView {
    BASIC = 1;
    FULL = 2;
}

message ListArticlesRequest {
    ArticleView view = 1
}
```

## Source code
The demo project contains a blog-like database with articles, comments and comments authors. Let's see how to navigate the blog using our APIs:

### REST
To fetch a document, you first need its id. Run:

```
curl http://localhost:4000/articles
```

Select any of the articles ids and then:

```
curl -v http://localhost:4000/articles/5fa95ab13e06593195951418
```

The above request will return the selected article in the default Media Type (`application/json`):

```json
{
    "title": "Title 2",
    "description": "Description 2"
}
```

In order to fetch in other Media Type (for example, `text/plain`):

```
curl -v --header "Accept: text/plain" http://localhost:4000/article/5fa95ab13e06593195951418
```

Which might return something like:

```
This is the text/plain representation of the article #5fa95ab13e06593195951418
```

The `article` resource also accepts sparse fieldsets. We can choose between `title`, `description`, `createdAt`, `updatedAt`, `comments`.

```
curl "http://localhost:4000/articles/5fa86e4fd3ec9e5eb38447a1?fields[]=title&fields=comments"
```

Which will return something like:

```json
{
  "title":"Title 100",
  "comments":[
    {"id":"5fa86f33558bab6f3f048dce","author":"Author 0","text":"Comment text 0"},
    {"id":"5fa86f33558bab6f3f048dcf","author":"Author 1","text":"Comment text 1"},
    {"id":"5fa86f33558bab6f3f048dd0","author":"Author 2","text":"Comment text 2"},
    {"id":"5fa86f33558bab6f3f048dd1","author":"Author 3","text":"Comment text 3"},
    {"id":"5fa86f33558bab6f3f048dd2","author":"Author 4","text":"Comment text 4"}
  ]
}
```

Note that among those fields we find simple, scalar fields (like `id` or `author`) and embedded fields (like `comments`).

### GraphQL

To fetch an article, we first need to know which `article` we want to fetch. So, to fetch the `id` of the first `article`, we can run this query:

```graphql
query {
    articles(first: 1) {
        edges {
            node {
                id
            }
        }
    }
}
```

The above will return an `article` `id`. To fetch it, we can:

```graphql
query {
    article(id: "5fa991f18ca8e61b0f8c7d43") {
        id
    	title
    	description
    }
}
```

Which will return the info from the field:

```json
{
    "data": {
        "article": {
            "id": "5fa991f18ca8e61b0f8c7d43",
            "title": "Title 1",
            "description": "Description 1"
        }
    }
}
```

Note that it has returned the fields we have requested. This is a key feature of graphql that is not natively supported in REST.

We can also include embedded resources:

```graphql
query {
    article(id:"5fa991f18ca8e61b0f8c7d43") {
        comments {
            author
        }
    }
}
```

And we will get something like this:

```json
{
    "data": {
        "article": {
            "comments": [
                {"author": "Author 0"},
                {"author": "Author 1"},
                {"author": "Author 2"},
                {"author": "Author 3"},
                {"author": "Author 4"}
            ]
        }
    }
}
```

Finally, in addition to specify custom fields (whether they are composed or scalar types), we can also set _aliases_ to tell apart two elements of the same type:

```graphql
query {
    art1:article(id:"5fa9b07da5b7d93867f0634e") {
        comments {
            author
        }
    }
    art2:article(id:"5fa9b07da5b7d93867f06354") {
        title
    }
}
```

Here, we execute two queries of the type `article()`, each one returning a different result. Also note that they might be processed in parallel.

## Resources
* [Partial response in Google Tasks API][]
* [JSON:API Sparse Fieldsets][]
* [OData: Querying][]
* [GraphQL Leveler][]


[Partial response in Google Tasks API]: https://developers.google.com/tasks/performance#partial-response
[JSON:API Sparse Fieldsets]: https://jsonapi.org/format/#fetching-sparse-fieldsets
[OData: Querying]: https://www.odata.org/getting-started/basic-tutorial/
[GraphQL Leveler]: https://www.fourkitchens.com/blog/development/graphql-leveler-controlling-shape-query/
[Server-Driven Negotiation]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Content_negotiation#Server-driven_content_negotiation
[Agent-Driven Negotiation]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Content_negotiation#Agent-driven_negotiation
[`Accept`]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept
[`Accept-Charset`]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Charset
[`Accept-Language`]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Language
[`Accept-Encoding`]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Encoding
[`Vary`]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Vary
