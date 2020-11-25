# Contract
Sticking to the [Google Coud API Design Guide][], we can distinguise between _standard methods_ and [_custom methods_](./custom_methods.md). _Standard methods_ are:

* `List` - Fetches a list of resources from a collection.
* `Get` - Fetches a single resource.
* `Create` - Creates a new resource.
* `Update` - Updates an existing resource.
* `Delete` - Deletes a resource.

Each of these are mapped to a different _operation_ in each API style.

## REST
When implementing a _RESTful Web Service_, we will be using HTTP as the underlying transfer protocol to manipulate resources. According to REST constraints, the system should be visible. Here this means we should leverage the available methods on HTTP rather than encapsulating our own methods within our request representations (i.e. we should not do _tunnelling_).

HTTP defines a number of methods along with their description ([HTTP/1.1 Request Methods (RFC 7231)][] and [PATCH Method for HTTP (RFC 5789)][]):

| Method  | Meaning                                                                             | Is safe | Is idempotent |
|---------|-------------------------------------------------------------------------------------|---------|---------------|
| GET     | Transfer a current representation of the target resource                            | yes     | yes           |
| HEAD    | Same as GET, but only transfer the status line and header section                   | yes     | yes           |
| OPTIONS | Describe the communication options for the target resource                          | yes     | yes           |
| PUT     | Replace all current representations of the target resource with the request payload | no      | yes           |
| DELETE  | Remove all current representations of the target resource                           | no      | yes           |
| POST    | Perform resource-specific processing on the request payload                         | no      | no            |
| PATCH   | Apply partial modifications (delta) to a resource                                   | no      | no            | 

A method is considered _safe_ as long as it does not have side-effects. And it is _idempotent_ when the side-effects of applying several identical requests is the same as for a single request.

REST specification does not mention much about which HTTP methods should be used for a certain operation. This is because REST is all about the architectural style, while HTTP methods are part of the Web's architecture. When mapping an API operation to an HTTP method we should consider: the semantic of the method; whether the operation is safe or idempotent; how affect caching; etc. But from the client point of view, it is not important which HTTP method maps an operation. There are some consensus, though:

### GET
`GET` is used for _safe_ and _idempotent_ data retrieval, either on documents or in collections/stores.

### HEAD and OPTIONS
These two methods are used for data inspection, so they both are _safe_ and _idempotent_. When only the metadata (header) of a resource is required, `HEAD` can be used instead of `GET`.

To discover how we can interact with a resource, `OPTIONS` will be used. This will return an `Allow` header listing all available methods. Note that, even though a client application can fetch this information at runtime, it increases the network traffic.

### POST
`POST` is the most controversial HTTP method. It can be used for a number of things:

* To add a new item into a _collection_. This is like calling to a factory method. A `Slug` (a suggested identifier) can optionally be set, but the identifier will be defined by the server.
* To exercise a _controller_.
* To run _safe_ and _idempotent_ operations that exceed the maximum length for an identifier. For example, when running a complex query whose URI-representation is invalid.
* And to run any other _unsafe_ and _nonidempotent_ operation. For example, an **asynchronous task**.

### PUT
Used to:

* Update a mutable resource. [Conditional Requests (RFC 7232)][] are recommended in order to prevent concurrency problems.
* Add a new item into a _store_, this is, when the client can decide the identifier of the resource.

### DELETE
It is used to remove a resource. This operation is not _safe_ (i.e. it has side effects), but it is _idempotent_. This is controversial: what should we return when asked to remove a resource that never existed? A `404 Not Found`? What should we return when deleting a resource that was previously removed? `204 No Content`? Is this secure enough? Should we maintain a list of removed identifiers?

### Other HTTP methods
It is encouraged not to use other HTTP methods, like those proposed by [WebDAV (RFC 4918)][], and instead use `POST`. However, some people does not discourage using `PATCH`.

### HTTP is not CRUD
It's fundamental to notice several things. Neither REST nor HTTP are CRUD. Some HTTP methods clearly map CRUD action (i.e. `GET` maps _Read_ and `DELETE` maps _Delete_). However:

* `POST` can run a number of _non-idempotent_ and _unsafe_ operations. One of those operations might be _Create_. Performing other actions it is also correct. Remember, the entire SOAP protocol is _tunnelled_ through `POST`.
* `PUT` does not only _Update_ a resource. It can also _Create_ a specific resource.

### API Standard Methods
Reference table of mapping between _standard methods_ and HTTP methods:

| Standard Method   | HTTP method                                         |
|-------------------|-----------------------------------------------------|
| `List`            | `GET <collection URL>`                              |
| `Get`             | `GET <document URL>`                                |
| `Create`          | `POST <collection URL>` or `PUT <document URL>`     |
| `Update`          | `PUT <document URL>` or `PATCH <document URL>`      |
| `Delete`          | `DELETE <document URL>`                             |

## GraphQL
Both REST and GraphQL run on top of HTTP, but unlike REST, GraphQL does not promotes the visibility of its transport protocol. Instead, it provides a quite simple set of operations available for API designers. The entry point of every GraphQL consists of three different operation types:

| Operation Type | Meaning                                                                    |
|----------------|----------------------------------------------------------------------------|
| `query`        | Allow to get a graph from the remote API                                   |
| `mutation`     | Operation which causes side effects in the remote entity graph             |
| `subscription` | Let an client application create a websocket-based subscription to a topic |

The mapping between this operations types and our _standard methods_ is straightforward:

| Standard Method   | GraphQL operation type    |
|-------------------|---------------------------|
| `List`            | `query`                   |
| `Get`             | `query`                   |
| `Create`          | `mutation`                |
| `Update`          | `mutation`                |
| `Delete`          | `mutation`                |

[Google Coud API Design Guide]: https://cloud.google.com/apis/design/standard_methods
[HTTP/1.1 Request Methods (RFC 7231)]: https://tools.ietf.org/html/rfc7231#section-4.1
[PATCH Method for HTTP (RFC 5789)]: https://tools.ietf.org/html/rfc5789
[Conditional Requests (RFC 7232)]: https://tools.ietf.org/html/rfc7232
[WebDAV (RFC 4918)]: https://tools.ietf.org/html/rfc4918
