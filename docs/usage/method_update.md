# Standard method: update (replace)
Sometimes, we need to update an existing resource. This resource might be a single document or might be a document in a repository of type _collection_. For example, to update a product in a shop.

## Regular updates
These are simple updates that will simply replace the overall resource with the new one. No additional checking will be done.

### REST
This is an _unsafe_ and _idempotent_ operation. `PUT` suits well here. The request will be done against the identifier of the resource to be updated, for example, `/products/12`. The body will contain the new resource that will override the previous one, along with an entity header specifying the representation being used, for example `application/json`.

Example:

```
PUT /products/12 HTTP/1.1
Content-Type: application/json

{
    'name': 'Personal Computer',
    'price': 550
}
```

If a read-only field conflicts with the expected value, it may be ignored, or a `409 - Conflict` status code can be returned.

### GraphQL
For this, a _mutation_ is used. In this case, as in a `PUT` operation in REST, a full replacement will be done. So, the _mutation_ will receive as an argument the new state of the resource, as in the following definition:

```graphql
type Mutation {
    updateProduct(id: ID!, product:ProductInput!): Product
}
```

That can be used like this:

```graphql
mutation UpdateFullProduct($product:ProductInput!) {
    updateProduct(product: $product) {
        id
        price
    }
}
```

Variables:

```json
{
    "product": {
        "id": 5,
        "name": "Smartphone",
        "price": 350
    }
}
```

Note that the _operation_ has been named `UpdateFullProduct`; an _operation_ might contain several _mutations_, so this is a convenient way to wrap them in a structure similar to a function. Also note that the _mutations_ within are run in series. We can define variables to invoke this operation.

Also note that since our _mutation_ `updateProduct` returns a `Product`, we can ask for the specific fields we are interested in, as we do with _queries_.

### gRPC
A full update can be carried out using a regular RPC, as in:

```proto
service Blog {
    rpc UpdateArticle(UpdateArticleRequest)
        returns (Article);
}

message UpdateArticleRequest {
    Article article = 1;
}
```

The updated resource will be returned.

Even though it is possible to perform this full update, [Google Cloud API Design Guide](https://cloud.google.com/apis/design/standard_methods#update) recommends that a [partial update](method_update_partial.md) should be used instead, to make the API more resilient to schema evolution.

## Conditional requests
Here our backend will be protected against race conditions.

### REST
Since REST promotes visibility, a _RESTful Web Services_ takes advantage of the HTTP built-in caching and of the [Conditional Requests (RFC 7232)][]. Every response might contain:

* `ETag` - or `entity tag`. Part of the HTTP specification, this is a header to represent a specific version of a resource from. Typically, hash functions are used for this. Clients may save a copy of the resource so that, once they are expired (which is controlled by the `Expires` and/or `Cache-Control` headers), they can make a new request sending its `ETag` in the `If-None-Match` header field. If the server detects the `ETag` has not change, then it will return a `304 - Not Modified` response.
* `Last-Modified` - This works like `ETag` but, unlike this, it is timestamp-based. This timestamp is set into `If-Modified-Since` header when sending a new request.

When running a _safe_ request, as in `GET`, this is useful to save resources. For _unsafe_ requests, like `POST`, `PUT`, `PATCH` or `DELETE`, these values can be used to provide concurrency control.

To protect a resource against concurrency problems, like race conditions, we can require any of these headers:

* `If-Match` for `ETag`. The operation will take place as long as the current `ETag` matches the provided one.
* `If-Unmodified-Since` for `Last-Modified`. The operation will be carried out only if current `Last-Modified` value is no higher than the provided in `If-Unmodified-Since`.

When the conditions are not satisfied, a `412 - Precondition Failed` is returned:

1. If no conditional headers have been provided:
    1. If the resource exist: `403 Forbidden`
    2. If the resource does not exist
       1. If this is a store: `201 Created`
       2. If this is a collection: `404 Not Found`
2. If conditional headers are provided:
    1. If preconditions match: `200 Ok`
    2. If preconditions do not match: `412 Precondition Failed`

Example:

```
PUT /products/12 HTTP/1.1
Content-Type: application/json
If-Match: W/"2f-1enSYy6fyIcEanN2CM5rqcZISwc"

{
    'name': 'Personal Computer',
    'price': 550
}
```

#### One-time URIs
We can also use _one-time URIs_ to implement conditional `POST` requests. These are URIs tailored for a specific operation and for a given resource version. Let's suppose we have a `comment` resource which includes a link to remove it. This link would be conditional, i.e. it works as long as the given resource has not been modified). To go about this, we generate a one-time URI: this is, a URI which somehow identifies current request, as in:

```
Link: <http://www.example.com/comments/gtlrx8et2l>;rel="remove"
```

### GraphQL and gRPC
Unlike REST, neither GraphQL nor gRPC provide a native pattern to prevent concurrent requests. However, it's straight forward to implement the same protection as long as our entities contain some kind of versioning field, like a version number or a last-modified field. This fits well with _update_ operations, but might be _cumbersome_ with patch or delete operations.

## Source code
The source code comes with a battery of preexisting articles.

### REST

```
curl -v http://localhost:4000/articles
```

Pick any `id`. To update it, code will require you to provide conditional headers. If we were to request an existing article not providing the `If-Unmodified-Since` header, a `403 Forbidden` header would be returned:

```
curl -v --header "Content-Type: application/json" \
--request PUT \
--data '{"title": "This is an updated article", "description": "Description of an updated article"' \
http://localhost:4000/articles/5fa96503bd00b971bafa81d3
```

When `If-Unmodified-Since` is provided, but the preconditions are not met, a `412 Precondition Failed` will be returned:

```
curl -v --header "Content-Type: application/json" \
--header "If-Unmodified-Since: Sun, 24 Oct 2020 18:31:40 GMT" \
--request PUT \
--data '{"title": "This is an updated article", "description": "Description of an updated article"' \
http://localhost:4000/articles/5fa96503bd00b971bafa81d3
```

Finally, if the preconditions are met, the resource is successfully updated:

```
curl -v --header "Content-Type: application/json" \
--header "If-Unmodified-Since: Sun, 25 Oct 2020 18:31:40 GMT" \
--request PUT \
--data '{"title": "This is an updated article", "description": "Description of an updated article"' \
http://localhost:4000/articles/5fa96503bd00b971bafa81d3
```

### GraphQL
To update an article in our example, we can run this operation:

```graphql
mutation UpdateArticle($id:ID!, $article:ArticleInput!) {
    updateArticle(id:$id,article:$article) {
        title
        description
    }
}
```

With these variables:

```json
{
    "id": "5faeed572bbb8d6e218829c7",
    "article": {
        "title": "New title",
        "description": "New description"
    }
}
```

### gRPC
TODO

[Conditional Requests (RFC 7232)]: https://tools.ietf.org/html/rfc7232
