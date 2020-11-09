# Update document in a collection
Sometimes, we need to update an existing resource. This resource might be a single document or might be a document in a repository of type _collection_. For example, to update a product in a shop.

## Request
This is an _unsafe_ and _idempotent_ operation. `PUT` suits well here. The request will be done against the identifier of the resource to be updated, for example, `/products/12`. The body will contain the new resource that will override the previous one, along with an entity header specifying the representation being used, for example `application/json`.

### Example
Example:

```
PUT /products/12 HTTP/1.1
Content-Type: application/json

{
    'name': 'Personal Computer',
    'price': 550
}
```

## Conditional requests
Since REST promotes visibility, a RESTful Web Services takes advantage of the HTTP built-in caching and [Conditional Requests (RFC 7232)][]. Every response might contain:

* `ETag` - or `entity tag`. Part of the HTTP specification, this is a header to represent a specific version of a resource from. Tipically, hash functions are used for this. Clients may save a copy of the resource so that, once they are expired (which is controlled by the `Expired` and/or `Cache-Control` headers), they can make a new request sending its `ETag` in the `If-None-Match` header field. If the server detects the `ETag` has not change, then it will return a `304 - Not Modified` response.
* `Last-Modified` - This works like `ETag` but, unlike this, it is timestamp-based. This timestamp is set into `If-Modified-Since` header when sending a new request.

### Concurrency
This is useful to save resources when runing _safe_ requests, as in `GET`. For _unsafe_ requests, like `POST`, `PUT`, `PATCH` or `DELETE`, these mechanisms can be used to provide concurrency control. When these headers are provided:

* `If-Match` for `ETag`.
* `If-Unmodified-Since` for `Last-Modified`.

then we can modify a resource as long as the preconditions are matched. When they don't match, a `412 - Precondition Failed` is returned.

### One-time URIs
We can also use _one-time URIs_ to implement conditional `POST` requests. These are URIs tailored for a specific operation and for a given resource version. Let's suppose we have a `comment` resource which includes a link to remove it. We ant this link to be conditional (it works as long as the given resource has not been modified). To go about this, we generate a one-time URI: this is, a URI which somehow identifies current request, as in:

`Link: <http://www.example.com/comments/gtlrx8et2l>;rel="remove"`

### Example
Let's update previous example. Now the server will enforce _conditional requests_ to prevent race conditions when updating the resource. For this, the client must provide one or more conditional headers when updating, like If-Unmodified-Since` or `If-Match` (they can be empty on creation).

```
PUT /products/12 HTTP/1.1
Content-Type: application/json
If-Match: W/"2f-1enSYy6fyIcEanN2CM5rqcZISwc"

{
    'name': 'Personal Computer',
    'price': 550
}
```

Since the server observes _conditional requests_, it will behave like this:
1. If no conditional headers have been provided:
    1. If the resource exist: `403 Forbidden`
    2. If the resource does not exist
       1. If this is a store: `201 Created`
       2. If this is a collection: `404 Not Found`
2. If conditional headers are provided:
    1. If preconditions match: `200 Ok`
    2. If preconditions do not match: `412 Precondition Failed`

## Example
The source code comes with a battery of preexisting articles.

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

Finally, if the preconditions are met, the resource is succesfully updated:

```
curl -v --header "Content-Type: application/json" \
--header "If-Unmodified-Since: Sun, 25 Oct 2020 18:31:40 GMT" \
--request PUT \
--data '{"title": "This is an updated article", "description": "Description of an updated article"' \
http://localhost:4000/articles/5fa96503bd00b971bafa81d3
```

[Conditional Requests (RFC 7232)]: https://tools.ietf.org/html/rfc7232
