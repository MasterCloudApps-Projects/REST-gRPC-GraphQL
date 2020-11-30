#  Standard method: delete

## REST
To delete a resource (regardless of its type), we can just carry out a `DELETE` HTTP call to the resource.

```
DELETE /products/1 HTTP/1.1
```

Typically, a `204 No Content` will be returned.

Since the `DELETE` method is _idempotent_, when run twice or more times, same result should be returned. This is controversial: how can we distinguish an already removed resource from a resource that never existed in the first place? Should we keep a local list of already-removed identifiers? In the end, most REST implementations handles `DELETE` requests as idempotent in effect, but not in the response.

## GraphQL
A custom _mutation_ will be created. This will somehow receive an identifier of the to-be-deleted resource. There is no consensus on the best-practices when selecting the return type. For example, when [deleting a project in the GitHub GraphQL API](https://docs.github.com/en/free-pro-team@latest/graphql/reference/mutations#deleteproject), the project owner is returned, which might be convenient for GitHub usage case. Hasura, on the other side, when deleting a resource from its identifier it [returns the just removed resource](https://hasura.io/docs/1.0/graphql/core/mutations/delete.html), which is a good enough response for a general purpose, automatically generated API.

## gRPC
To delete a resource, a new RPC method will be created:

```proto
rpc DeleteArticle(DeleteArticleRequest) returns (google.protobuf.Empty);

message DeleteArticleRequest {
  string id = 1;
}
```

As in REST, an empty response will be returned.

An idempotent effect is also expected in gRPC, but the response might yield different responses because only the first one will result in a success code. The rest of them will throw a `google.rpc.Code.NOT_FOUND`.

## Source code

### REST
First, we will create a new entry:

```
curl -v -H "Content-Type: application/json" \
    -d '{ "title": "This is my first post", "description": "This is the beginning of a beautiful friendship"}' \
    http://localhost:4000/articles

```

The above request will return a Location header. To fetch the entry created above, run (updating the identifier):

```
curl -v http://localhost:4000/articles/5fa5694ce5f5657b361d7cfe
```

Finally, to delete it:

```
curl -v -X DELETE http://localhost:4000/articles/5fa5694ce5f5657b361d7cfe
```

### GraphQL
First, let's create a new article, run:

```graphql
mutation {
    createArticle(
        article: {
            title: "This is my first post",
            description: "This is the beginning of a beautiful friendship"
        }
    ) {
        id
    }
}
```

The above request will return the id of the newly created resource. To fetch the resource, you can run:

```graphql
query {
    article(id: "5fa5cb0c38137b23c1ac82c4") { id, title }
}
```

To remove it, just exercise the following mutation `deleteArticle(id: ID!): Article`:

```graphql
mutation {
    deleteArticle(id: "5fa6d242bc92b1350046395d" ) { id }
}
```

### gRPC
An `rpc` has been defined to delete an article in the gRPC service:

```proto
    rpc DeleteArticle(DeleteArticleRequest) returns (google.protobuf.Empty);
```

To exercise it, first identify which articles are available. Run the gprc client, `npm run grpcc`, and then:

```js
client.ListArticles({}, pr)
```

Then, run delete an article setting its `article_id`, as in:

```js
client.deleteArticle({id: '5fc3ffe378b3dd2565ed83ed'}, pr)
```
