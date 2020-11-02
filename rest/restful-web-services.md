# RESTful Web Service
A service which fully adheres to the REST specification is said to be a _RESTful Service_. Also note that, according to Roy's dissertation, _"REST does not restrict communication to a particular protocol"_. However, most of the time REST is Web-based. In such case, we would call it a _RESTful Web Service_.

## REST Uniform Interface
When it comes to the REST constraint about _Uniform Interface_, this is how each sub-constraint is enforced in a _RESTful Web Service_:
* **Identification of resources** - each resource is identified by a [URIs (RFC 3986)][].
* **Manipulation of resources through representations** - the manipulation of resources state is done through the standard [HTTP (RFC 7231)][]. There are no verbs in REST, but not because HTTP already has verbs, but because we are transfering a _state_, rather than calling instructions.
* **self-descriptive messages** - the [Media Type Specification (RFC 6838)][] (formerly known as MIME types) is used to make messages self-descriptive.
* **Hypermedia as the engine of application state (HATEOAS)** - hyperlinks in the resource returned by the browser can be used to allow clients to transition from one state to another.

To sum up: resources have identifiers (URIs), and we can leverage the underlying transfer protocol (namely, HTTP) to modify (for example, using `PUT`) a resource (i.e. change its state) using its representation (for example, a JSON object).

## Richardson Maturity Model
The so called [Richardson Maturity Model][] describes different levels on how RESTFul a Web Service is:

* **Level Zero** - One URI and one HTTP method. Example: XML-RPC or SOAP.
* **Level One** - Many URIs and one HTTP method.
* **Level Two** - Many URIs and multiple HTTP methods.
* **Level Four** - Hypermedia: leverage links and forms.

## Identification of resources
In _RESTful Web Services_, [URIs (RFC 3986)][] are used to identify resources. However, the REST specification does not state anything about how identifiers should look like: they are just **opaque identifiers**. And code need not rely on any URI convention. According to [Roy Fielding words][Roy Fielding about the opacity of resource identifiers],

> A REST API should be entered with no prior knowledge beyond the initial URI (bookmark) and set of standardized media types that are appropriate for the intended audience (i.e., expected to be understood by any client that might use the API).

So, technically, all these URI might be completely RESTful:

* https://example.com/books/12
* https://example.com/books?getBook=12
* https://example.com/89110c64-0c83-11eb-adc1-0242ac120002

This contrasts with [common implementation of REST APIs](./rest-like.md).

### URI Templates and URI design
Even thoguh according to the REST contraints neither the client nor the documentation should rely on a specific URI convention, that does not mean that we cannot follow a convention to (1) make the URIs human-readable, (2) to save design time or (3) to distribute the processing based on our URIs path. It is completely right to use, for example, [URI Templates (RFC 6570)][].

Many of the rules on how to design URIs are opinionated. Still, some have major approval in the community, like the ones presented in [REST API Design Rulebook, by Mark Masse][]:

* Forward slash (/): won't be used as the last character of a URI. It is used to specify a hierarchical relationship. This allows for mapping compositions of elements.
* Use hyphens (-), and not underscore (_), to improve readability.
* Use lowercase.
* Do not include file extensions. Use the HTTP `Accept` header instead.

### URI Archetypes
There is almost a consensus about whether to use plural or singular names:

**Document**:
Use a singular noun:

```
https://example.com/universities/urjc
https://example.com/universities/urjc/masters/cloud-computing
https://example.com/universities/urjc/masters/cloud-computing/subjects/api-design
```

**Collection and store**
Use a plural noun:

```
https://example.com/universities
https://example.com/universities/urjc/masters
https://example.com/universities/urjc/masters/cloud-computing/subjects
```

**Controller**
Use a verb:

```
https://example.com/albums/341/play
POST https://example.com/products/51240/discountoffer
```

## Manipulation of resources
When implementing a _RESTful Web Service_, we will be using HTTP as the underlying transfer protocol to manipulate resources. According to REST constraints, the system should be visible. Here this means we should leverage the available methods of HTTP rather than encapsulating our own methods within our request representations (i.e. we should not do _tunnelling_).

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

* Update a mutable resource.
* Add a new item into a _store_, this is, when the client can decide the identifier of the resource.

### DELETE
It is used to remove a resource. This operation is not _safe_ (i.e. it has side effects), but it is _idempotent_. This is controversial: what should we return when asked to remove a resource that never existed? A `404 Not Found`? What should we return when deleting a resource that was previously removed? `204 No Content`? Is this secure enough? Should we maintain a list of removed identifiers?

### Other methods
It is encouraged not to use other HTTP methods, like those proposed by [WebDAV (RFC 4918)][], and instead use `POST`. However, some people does not discourage using `PATCH`.

### HTTP is not CRUD
It's fundamental to notice several things. Neither REST nor HTTP are CRUD. Some HTTP methods clearly map CRUD action (i.e. `GET` maps _Read_ and `DELETE` maps _Delete_). However:

* `POST` can run a number of _non-idempotent_ and _unsafe_ operations. One of those operations might be _Create_. Performing other actions it is also correct. Remember, the entire SOAP protocol is _tunnelled_ through `POST`.
* `PUT` does not only _Update_ a resource. It can also _Create_ a specific resource.

### Error messages and error responses
A _RESTful Web Service_ is expected to return error responses both in the HTTP header and in the payload:

**Header**
Set a meaningful error code. For example, when requesting a nonexisting resource, return a `404`. However, sometimes this can be confusing:

* Consider this identifier: `/departments/:deptID/employees?id=Smith`. If for the given department there is no employee whose identifier is `smith`, a `404` looks fine. What if there is no department for `:deptID`? What should we return?
* If we get a `404`, can assume a resource does not exist? Can we safely delete our local copy? What if we are getting that just because of a missconfiguration on NGINX? HTTP server errors might be conflated with application logic errors.

**Body**
HTTP responses are limited, as we have just seen. Sometimes, we need room to add more details. We can express error descriptions in the body. For this, several solutions have been proposed: [JSend][], [Problem Details For HTTP APIs (RFC 7807)][]. For example, in RFC 7807 we can express an _out of credit_ error like this:

```
 {
    "type": "https://example.com/probs/out-of-credit",
    "title": "You do not have enough credit.",
    "detail": "Your current balance is 30, but that costs 50.",
    "instance": "/account/12345/msgs/abc",
    "balance": 30,
    "accounts": ["/account/12345", "/account/67890"]
}
```

## Message description
This constraint states that we need each message to be self-descriptive; this comprehends the payload as well as the metadata.

### Metadata
In _RESTful Web Services_, we rely on HTTP to specify the metadata:

* [`Content-Type`][]: the Media Type plus a charset. This is also used to let clients specify the desired representation.
* [`Last-Modified`][]: last modification date and time of a resource.
* [`Content-Encoding`][]: compression method: `gzip`, `compress`, `deflate`, `identity`, `br`...
* [`Content-Length`][]: size in bytes of the body.
* [`Content-Language`][]: describes the language intended for the audience.

### Resource representation
To choose the apropriate representation, the `Content-Type` entity header will be used. See the [IANA document on Media-Types][] to check a comprehensive list of media types approved by the IANA. For example, `text/plain` or `image/png`. An extensible format, like `application/xml` or `application/json` can be used as well. Event a binary representation as [Protobuf can be used in REST][Protobuf and REST].

To describe JSON resources, several specifications can be used:
* [JSON Schema][], using `application/schema+json`.
* [JSON API][], using `application/vnd.api+json`.

[GitHub defines its own media types][GitHub custom Media Types], as in:

```
application/vnd.github+json
application/vnd.github.v3+json
application/vnd.github.v3.raw+json
application/vnd.github.v3.text+json
application/vnd.github.v3.html+json
application/vnd.github.v3.full+json
application/vnd.github.v3.diff
application/vnd.github.v3.patch
```

However, some people argue that [minting new Media Types should be avoided][].

### Content Negotiation
Content negotiation is the process to selected the apropriate representation for a resource. It can be [Server-Driven Negotiation][] or [Agent-Driven Negotiation][]

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

## HATEOAS
We want to leverage hypermedia turn our service into a states machine. The state is the resource itself. To change the state we will use hyperlinks.

### Note on Versioning
When it comes to versioning, according to [Roy Fielding keynote on Evolve'13][], the best practice for versioning a REST API is not to version it. REST is already defined as a state machine (HATEOAS) where each state can be dynamic and each transition can be redirected (linked). So instead of agreeing on an interface, to change the state, client software should only need to _follow_ the apropriate links (as we humans do when we use a web). But still, [an API might need updates which break backwards compatibility][API Change Strategy] (like fixing a typo in a schema).

### Links specifications

There is no unique medium to express them:

* HTTP: [Web Links (RFC 8288)][] - Send links through the HTTP headers. Apropriate when the representation does not allow links (i.e. an image or a plain text) or when it's required to read links without parsing the body.
* JSON: [JSON API][] (it can descrive links as well), [JSON-LD][], [JSON Hyper-Schema][] (the hypermedia solution of JSON Schema), [HAL (Hypertext Application Language)][] or [Hydra][] (based on JSON-LD).
* XML: [Atom (RFC 5023)][].

Typically, the type of relation in a link is specified in a `rel` field. IANA maintains a [list of standard link relations][IANA list of link relations].

To generate a [state machine in REST][] we can think in a microwave oven. When we first get it, it might returns to turn it on:

```
GET /microwaves/12

{
    "state": "off",
    "actions": [
        {
            "rel": "on",
            "href": "/microwaves/12",
            "method": "PUT",
            "Expects": { "state": "on"}
        }
    ]
}
```

Then, following the `on` link, the microwave would be turned on.

### About `rel`
Some people (See [RESTful Web Services Cookbook][]) suggest we express the action type in the `rel` following these rules:

* Use the existing names, like `self`, `alternate`, `related`, `previous`, `next`, `first` and `last`.
* If there is no existing name, create a new one. Express that relation as a URI. Also, provide an HTML documentation for that relation at that URI.

### Real World Examples
Criticisms of HATEOAS often argue that there are no real-world examples of it, which is unfair. One of the most widely-used REST APIs in the world makes use of it: [PayPal][PayPal and HATEOAS]. Here is an example extract from a response:

```
{
  "links": [{
    "href": "https://api.paypal.com/v1/payments/sale/36C38912MN9658832",
    "rel": "self",
    "method": "GET"
  }, {
    "href": "https://api.paypal.com/v1/payments/sale/36C38912MN9658832/refund",
    "rel": "refund",
    "method": "POST"
  }, {
    "href": "https://api.paypal.com/v1/payments/payment/PAY-5YK922393D847794YKER7MUI",
    "rel": "parent_payment",
    "method": "GET"
  }]
}
```

## Querying URI
Queries are used to filter, sort and paginate both collections and stores. Brackets or colon might be handy to use operators:

* Get all: `GET /universities`.
* Basic filtering. Select those whose `country` is `spain`: `GET /universities?country=spain`.
* Filtering with operand: Select those whose `country` is not equal to `spain`: `GET /universities?country[neq]=spain`.
* Sorting: `GET /universities?sort_by=-date,id`.
* Select specific fields: `GET /universities?fields=id,name,departments(name)`. Examples: [Google Tasks API][Partial response in Google Tasks API] or [Sparse Fieldsets in JSON API][JSON API].
* Include sub-resources: our resource might contain a collection of other type. We can use something like `GET /posts/12?embed=comments,author.name` to fetch a blog post along with all its comments and its author name.

### Pagination
We tyipically identify two different pagination mechanisms:
* Offset-based pagination: `GET /universities?limit=10&offset=30`.
* [Cursor-based pagination][Cursor-based pagination in Facebook API]: `GET /universities?limit=10&next=uc3m`.

_Cursor-based_ pagination is more popular nowadays.

It can also contain `Web Links` headers to help traversing a collection of resources. See for example the [GitHub API][Pagination with Web Links in GitHub API].

## Security
We use

* `HTTP Basic Access Authentication`
* `HTTP Digest Access Authentication`
* `OAuth 2`

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
We can also use _one-time URIs_ to implement conditional `POST` requests. These are URIs tailored for a specific operation and for a given resource version. Let's suppose we have a `comment` resource which includes a link to remove it. We want this link to be conditional (it works as long as the given resource has not been modified). To go about this, we generate a one-time URI: this is, a URI which somehow identifies current request, as in:

`Link: <http://www.example.com/comments/gtlrx8et2l>;rel="remove"`

## Performance

Queries paginated, filtering, asynchronous tasks, N+1 with embedded.

### Rate limiting

## Examples
1. [Fetch a document](fetch_document/README.md).
2. [Fetch a document in a specific representation](fetch_specific_format/package.json)
3. [Create a document in a collection](create_document_collection/README.md)
4. [Put a document in a store](put_document_store/README.md)
5. [Update a document](partial_update/README.md)
6. [Create a resource asynchronously](asynchronous_operation/README.md)
7. [Partially update a document](partial_update/README.md)
8. [Delete a document](delete/README.md)
9. [Run action](run_action/README.md)

[URIs (RFC 3986)]: https://tools.ietf.org/html/rfc3986
[URI Templates (RFC 6570)]: https://tools.ietf.org/html/rfc6570
[Media Type Specification (RFC 6838)]: https://tools.ietf.org/html/rfc6838
[HTTP (RFC 7231)]: https://tools.ietf.org/html/rfc7231
[HTTP/1.1 Request Methods (RFC 7231)]: https://tools.ietf.org/html/rfc7231#section-4.1
[PATCH Method for HTTP (RFC 5789)]: https://tools.ietf.org/html/rfc5789
[WebDAV (RFC 4918)]: https://tools.ietf.org/html/rfc4918
[Web Links (RFC 8288)]: https://tools.ietf.org/html/rfc8288
[Atom (RFC 5023)]: https://tools.ietf.org/html/rfc5023#section-11
[Conditional Requests (RFC 7232)]: https://tools.ietf.org/html/rfc7232
[HAL (Hypertext Application Language)]: https://tools.ietf.org/html/draft-kelly-json-hal-08
[JSON Schema]: https://tools.ietf.org/html/draft-handrews-json-schema-02
[JSON Hyper-Schema]: https://tools.ietf.org/html/draft-handrews-json-schema-hyperschema-02
[Problem Details For HTTP APIs (RFC 7807)]: https://tools.ietf.org/html/rfc7807
[JSend]: https://github.com/omniti-labs/jsend
[Richardson Maturity Model]: https://www.crummy.com/writing/speaking/2008-QCon/act3.html
[JSON API]: https://jsonapi.org/
[Roy Fielding about the opacity of resource identifiers]: https://roy.gbiv.com/untangled/2008/rest-apis-must-be-hypertext-driven
[REST API Design Rulebook, by Mark Masse]: https://learning.oreilly.com/library/view/rest-api-design/9781449317904/
[`Content-Type`]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type
[`Last-Modified`]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Last-Modified
[`Content-Encoding`]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Encoding
[`Content-Length`]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Length
[`Content-Language`]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Language
[IANA document on Media-Types]: https://www.iana.org/assignments/media-types/media-types.xhtml
[GitHub custom Media Types]: https://docs.github.com/en/free-pro-team@latest/rest/overview/media-types
[Server-Driven Negotiation]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Content_negotiation#Server-driven_content_negotiation
[Agent-Driven Negotiation]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Content_negotiation#Agent-driven_negotiation
[`Accept`]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept
[`Accept-Charset`]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Charset
[`Accept-Language`]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Language
[`Accept-Encoding`]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Encoding
[`Vary`]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Vary
[JSON-LD]: https://json-ld.org/
[Hydra]: http://www.hydra-cg.com/spec/latest/core/
[Partial response in Google Tasks API]: https://developers.google.com/tasks/performance#partial-response
[Cursor-based pagination in Facebook API]: https://developers.facebook.com/docs/graph-api/using-graph-api/#paging
[Pagination with Web Links in GitHub API]: https://developer.github.com/v3/#pagination
[Roy Fielding keynote on Evolve'13]: https://www.slideshare.net/evolve_conference/201308-fielding-evolve
[Minting new Media Types should be avoided]: http://duncan-cragg.org/blog/post/minting-media-types-usually-less-restful-using-raw/
[state machine in REST]: https://nordicapis.com/designing-a-true-rest-state-machine/
[IANA list of link relations]: https://www.iana.org/assignments/link-relations/link-relations.xhtml
[PayPal and HATEOAS]: https://developer.paypal.com/docs/api/reference/api-responses/#hateoas-links
[API Change Strategy]: https://nordicapis.com/api-change-strategy/
[RESTful Web Services Cookbook]: https://learning.oreilly.com/library/view/restful-web-services/9780596809140/
[Protobuf and REST]: https://medium.com/swlh/supercharge-your-rest-apis-with-protobuf-b38d3d7a28d3
