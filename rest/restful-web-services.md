# RESTful Web Service
As we've seen, resources have identifiers (URIs), and we can leverage the underlying transfer protocol (namely, HTTP) to modify (for example, using `PUT`) a resource (i.e. change its state) using its representation (for example, a JSON object).

## Identification of resources
In RESTful Web Services, [URIs](https://tools.ietf.org/html/rfc3986) are used to identify resources. However, the REST specification does not state anything about how identifiers should look like: they are just **opaque identifiers**. And code need not rely on any URI convention. According to [Roy Fielding words](https://roy.gbiv.com/untangled/2008/rest-apis-must-be-hypertext-driven),

> A REST API should be entered with no prior knowledge beyond the initial URI (bookmark) and set of standardized media types that are appropriate for the intended audience (i.e., expected to be understood by any client that might use the API).

So, technically, all these URI might be completely RESTful:

* https://example.com/books/12
* https://example.com/books?getBook=12
* https://example.com/89110c64-0c83-11eb-adc1-0242ac120002

### URI Templates and URI design
Even thoguh according to the REST contraints neither the client nor the documentation should rely on a specific URI convention, that does not mean that we cannot follow a convention to (1) make the URIs human-readable, (2) to save design time or (3) to distribute the processing based on our URIs path. It is completely right to use, for example, [URI Templates RFC 6570](https://tools.ietf.org/html/rfc6570).

Many of the rules on how to design URIs are opinionated. Still, some have major approval in the community, like the ones presented in [REST API Design Rulebook, by Mark Masse](https://learning.oreilly.com/library/view/rest-api-design/9781449317904/):

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
Use a singular noun:

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
When implementing a RESTful Web Service, we will be using HTTP as the underlying transfer protocol to manipulate resources. One of the constraints is that the system should be visible. Here this means we should leverage the available methods of HTTP rather than encapsulating our own methods within our request representations (i.e. we should not do _tunnelling_).

HTTP defines a number of methods along with their description ([RFC 7231](https://tools.ietf.org/html/rfc7231#section-4.1) and [RFC 5789](https://tools.ietf.org/html/rfc5789)):

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

REST specification does not mention much about which HTTP methods should be used for a certain operation. This is because REST is all about the architectural style, while HTTP methods are part of the Web's architecture. When maping an API operation to an HTTP method we should consider: the semantic of the method; whether the operation is safe or idempotent; how affect caching; etc. But from the client point of view, it is not important which HTTP method maps an operation. There are some consensus though:

### GET
It is used for _safe_ and _idempotent_ data retrieval, either on documents or in collections/stores.

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
It is encouraged not to use other HTTP methods, like those proposed by [WebDAV RFC 4918](https://tools.ietf.org/html/rfc4918), and instead use `POST`. However, some people does not discourage using `PATCH`.

### Beyond CRUD
It's fundamental to notice several things. Neither REST nor HTTP are CRUD. Some HTTP methods clearly map CRUD action (i.e. `GET` maps _Read_ and `DELETE` maps _Delete_). However:

* `POST` can run a number of _non-idempotent_ and _unsafe_ operations. One of those operations might be _Create_. Performing other actions it is also correct. Remember, the entire SOAP protocol is _tunnelled_ through `POST`.
* `PUT` does not only _Update_ a resource. It can also _Create_ a specific resource.

To map an operation that does not clearly match a CRUD action, we can:

* Map a state to a field. For example, a field called `status` for a music player which accepts a number of possible options, or a field called `activated` of type boolean.
* Create a new resource. This resource will map an action into it. For example, GitHub defined an embedded resource to gists (a form of shareable snippets of code) to _star_ or _unstar_ them, as in [`PUT|DELETE /gists/:gist_id/start`](https://developer.github.com/v3/gists/#star-a-gist).
* Create a resource of type _controller_. For example, to merge two resources.

### Error messages and error responses
A RESTful Web Service is expected to return error responses both in the HTTP header and in the payload:

**Header**
Set a meaningful error code. For example, when requesting a nonexisting resource, return a `404`. Please note, sometimes it is not so obvious. Consider this identifier: `/departments/:deptID/employees?id=Smith`. If for the given department there is no employee whose identifier is `smith`, a `404` looks fine. What if there is no department for `:deptID`? What should we return?

**Body**
Error descriptions should be expressed in the body using a certain resource type. For example:

```
{
  'code': 3334,
  'message': 'Invalid input',
  'errors': [
    {
      'code': 555,
      'field': 'field1',
      'message': 'Password should be at least 8-characters long'
    }
  ]
}
```

## Message description
This constraint states that we need each message to be self-descriptive; this comprehends the payload as well as the metadata.

### Metadata
In RESTful Web Services, we rely on HTTP to specify the metadata:

* [`Content-Type`][]: the Media Type plus a charset. This is also used to let clients specify the desired representation.
* [`Last-Modified`][]: last modification date and time of a resource.
* [`Content-Encoding`][]: compression method: `gzip`, `compress`, `deflate`, `identity`, `br`...
* [`Content-Length`][]: size in bytes of the body.
* [`Content-Language`][]: describes the language intended for the audience.

### Resource representation
To choose the apropriate representation, the `Content-Type` entity header will be used. See the [IANA document on Media-Types][] to check a comprehensive list of media types approved by the IANA. For example, `text/plain` or `image/png`. An extensible format, like `application/xml` or `application/json` can be used as well. [GitHub defines its own media types][GitHub custom Media Types], as in:

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

When using the OpenAPI Specification (formerly known as Swagger Specification), [JSON Schema][] is used to describe each resource.

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
We want to leverage hypermedia turn our service into a states machine. The state is the resource itself. To change the state we will use hyperlinks. There is no unique medium to express them:

* HTTP: [Web Links (RFC 8288)](https://tools.ietf.org/html/rfc8288) - Send links through the HTTP headers. Apropriate when the representation does not allow links (i.e. an image or a plain text) or when it's required to read links without parsing the body.
* JSON: [JSON-LD](https://json-ld.org/), [HAL (Hypertext Application Language)](https://tools.ietf.org/html/draft-kelly-json-hal-08) or [Hydra](http://www.hydra-cg.com/spec/latest/core/).
* XML: [Atom (RFC 5023)](https://tools.ietf.org/html/rfc5023#section-11).

To generate a state machine we can think in a microwave oven. When we first get it, it might returns to turn it on:

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
Some people (See _RESTful Web Services Cookbook_) suggest we express the action type in the `rel` following these rules:

* Use the existing names, like `self`, `alternate`, `related`, `previous`, `next`, `first` and `last`.
* If there is no existing name, create a new one. Express that relation as a URI. Also, provide an HTML documentation for that relation at that URI.

## Querying URI
Queries are used to filter, sort and paginate both collections and stores. Brackets or colon might be handy to use operators:

* Get all: `GET /universities`.
* Basic filtering. Select those whose `country` is `spain`: `GET /universities?country=spain`.
* Filtering with operand: Select those whose `country` is not equal to `spain`: `GET /universities?country[neq]=spain`.
* Sorting: `GET /universities?sort_by=-date,id`.
* Select specific fields: `GET /universities?fields=id,name,departments(name)`. Example: [Google Tasks API](https://developers.google.com/tasks/performance#partial-response).
* Include sub-resources: our resource might contain a collection of other type. We can use something like `GET /posts/12?embed=comments,author.name` to fetch a blog post along with all its comments and its author name.

### Pagination
We tyipically identify two different pagination mechanisms:
* Offset-based pagination: `GET /universities?limit=10&offset=30`.
* [Cursor-based pagination](https://developers.facebook.com/docs/graph-api/using-graph-api/#paging): `GET /universities?limit=10&next=uc3m`.

_Cursor-based_ pagination is more popular nowadays.

It can also contain `Web Links` headers to help traversing a collection of resources. See for example the [GitHub API](https://developer.github.com/v3/#pagination).

## Security
We use

* `HTTP Basic Access Authentication`
* `HTTP Digest Access Authentication`
* `OAuth 2`

## Conditional requests
Since REST promotes visibility, a RESTful Web Services takes advantage of the HTTP built-in caching. Every response might contain:

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


## Versioning
When it comes to versioning, according to [Roy Fielding keynote on Evolve'13](https://www.slideshare.net/evolve_conference/201308-fielding-evolve), the best practice for versioning a REST API is not to version it. REST is already defined as a state machine (HATEOAS) where each state can be dynamic and each transition can be redirected (linked). So instead of agreeing on an interface, to change the state, client software should only need to _follow_ the apropriate links (as we humans do when we use a web).

To read: https://nordicapis.com/api-change-strategy/

## Performance

Queries paginated, filtering, asynchronous tasks, N+1 with embedded.

### Rage limiting