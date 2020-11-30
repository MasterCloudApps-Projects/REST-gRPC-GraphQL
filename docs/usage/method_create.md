# Standard method: create
Sometimes, we want to add a new item to a collection. For example, to create a new article in a blog. Let's see how we would tackle this in each API style.

## REST
Many authors distinguise two types of repositories in REST: _collections_ and _stores_. Let's see each one of them.

### Collection
Adding an item to a collection is a _unsafe_ and _non-idempotent_ operation. It's not _idempotent_ because the identifier for the new resource is chosen by the server, so runing the same operation twice will generate two resources. For this, we have the `POST` method.

Typically, to create a document resource in a collection, the resource we operate into is the collection itself, so that the combination `POST` plus _collection_ works as a factory method. For the sake of simplicity, let's consider that `/articles` is the URI of the collection.

The entity body of the HTTP request will contain the resource to be added. This resource (the article) might be represented in any way, for example in JSON. This Media Type should be specified in the entity header of the request. Some servers may consider the value of the optional header `Slug` ([`Slug` is defined in the Atom (RFC 5023)][Slug]) to generate the identifier (URI).

The response, if successful, would be a `201 Created`. Typically, two things are included:

* A redirection to the new resource. This redirection is expressed through the `Location` header.
* A representation of the new resource. The _news_ will be added to the entity body; the `Content-Location` HEADER will identify the URI of the returned resource; and the `Content-Type` will specify the Media Type used for the resource.

Example request:

```
POST /articles HTTP/1.1
Content-Type: application/json
Slug: first-article

{
    'title': 'This is my first post',
    'description': 'This is the beginning of a beautiful friendship'
}
```

Response:

```
HTTP/1.1 201 Created
Content-Type: application/json
Location: /articles/first-post
Content-Location: /articles/first-post

{
    'title': 'This is my first post',
    'description': 'This is the beginning of a beautiful friendship'
}
```

### Stores
_Stores_ are repositories of _documents_. But unlike _collections_, this process is client-driven, i.e. the identifier is provided by the client. We can use a resource of type _store_ to upload binary resources, for example.

Adding a resource to a store is _unsafe_ and _idempotent_, so `PUT` will be used instead of `POST`. The identifier will be the one provided by the client to run the HTTP request, for example `/products/computer`.

The rest of the request will behave as a regular `POST` request to add a resource in a collection.

```
PUT /products/computer HTTP/1.1
Content-Type: application/json

{
    'name': 'Personal Computer',
    'price': 500
}
```

## GraphQL
As with any other _unsafe operations_, in GraphQL we will use a regular mutator. It's a best practice to return an object as a result of a mutation:

```graphql
type Mutation {
    createArticle(article:ArticleInput): Article
}
```

There are some usage cases where _idempotency_ is a convenient mechanism to enhance our API. For example, to make it resilient to some failures. To provide this, [several strategies are available][Building Resilient GraphQL APIs Using Idempotency], like requiring a unique key in each mutation.

### Real World Example
* [GitHub GraphQL API](https://docs.github.com/en/free-pro-team@latest/graphql/reference/mutations#createproject) the `createProject` mutation returns a `Project`.

## gRPC

Following the _resource-oriented_ design, a [`Create` method](https://cloud.google.com/apis/design/standard_methods#create) will be defined for each resource that can be created.

```proto
rpc CreateArticle(CreateArticleRequest) returns (Article);
```

Optionally, the request resource may contain a client-assigned id, similarly to [REST stores](#stores). If the resource exists:

* The server might fail, returning a `ALREADY_EXISTS` error message.
* The server may also assign a new resource identifier.

## Source code

### REST
To create a new entry in our example application, we will use a _collection_. Run:

```
curl -v -H "Content-Type: application/json" \
    -d '{ "title": "This is my first post", "description": "This is the beginning of a beautiful friendship"}' \
    http://localhost:4000/articles
```

The above request will return a Location header. To fetch the entry created above, run (updating the identifier):

```
curl -v --request GET http://localhost:4000/articles/5fa5694ce5f5657b361d7cfe
```

### GraphQL
To create a new `article`, run:

```graphql
mutation {
    createArticle(article: {
        title:"This is the title",
        description:"This is the description"
    }) {
        id
    }
}
```

The above request will return the id of the newly created resource. To fetch the resource, you can run:

```graphql
query {
    article(id:"5fa9941a8067e43ad0d79e88") {
        id
        title
        description
    }
}
```

### gRPC
The `rpc` to create a new article is as follows:

```proto
rpc CreateArticle(CreateArticleRequest) returns (Article);

message CreateArticleRequest {
    Article article = 1;
}
```

We can create a new article using the client application, `npm run grpcc`, and then:

```js
client.createArticle({article:{title:"New article", description:"This is the description"}}, pr)
```

The newly-created article will be returned.

## Resources
* [Slug (RFC 5023)][Slug]
* [Building Resilient GraphQL APIs Using Idempotency][]

[Slug]: https://tools.ietf.org/html/rfc5023#section-9.7
[Building Resilient GraphQL APIs Using Idempotency]: https://shopify.engineering/building-resilient-graphql-apis-using-idempotency
