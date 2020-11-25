# RESTful Web Service
A service which fully adheres to the REST specification is said to be a _RESTful Service_. Also note that, according to Roy's dissertation, _"REST does not restrict communication to a particular protocol"_. However, most of the time REST is Web-based. In such case, we would call it a _RESTful Web Service_.

REST leaves to the implementer a lot of decisions. Because of this, many standards have been developed:
* [OData](https://www.odata.org/)
* [JSON:API](https://jsonapi.org/)
* [OpenAPI](https://swagger.io/specification/)
* [JSON Schema][JSON Schema]

And many more!

## REST Uniform Interface
When it comes to the REST constraint about _Uniform Interface_, this is how each sub-constraint is enforced in a _RESTful Web Service_:
* [**Identification of resources**](#identification-of-resources) - each resource is identified by a [URIs (RFC 3986)][].
* [**Manipulation of resources through representations**](#manipulation-of-resources) - the manipulation of resources state is done through the standard [HTTP (RFC 7231)][]. There are no verbs in REST, but not because HTTP already has verbs, but because we are transfering a _state_, rather than calling instructions.
* **self-descriptive messages** - the [Media Type Specification (RFC 6838)][] (formerly known as MIME types) is used to make messages self-descriptive.
* [**Hypermedia as the engine of application state (HATEOAS)**](#hateoas) - hyperlinks in the resource returned by the browser can be used to allow clients to transition from one state to another.

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

## Resources
* [Web API Design: The Missing Link](https://cloud.google.com/files/apigee/apigee-web-api-design-the-missing-link-ebook.pdf)

[URIs (RFC 3986)]: https://tools.ietf.org/html/rfc3986
[URI Templates (RFC 6570)]: https://tools.ietf.org/html/rfc6570
[Media Type Specification (RFC 6838)]: https://tools.ietf.org/html/rfc6838
[HTTP (RFC 7231)]: https://tools.ietf.org/html/rfc7231
[Web Links (RFC 8288)]: https://tools.ietf.org/html/rfc8288
[Atom (RFC 5023)]: https://tools.ietf.org/html/rfc5023#section-11
[HAL (Hypertext Application Language)]: https://tools.ietf.org/html/draft-kelly-json-hal-08
[JSON Hyper-Schema]: https://tools.ietf.org/html/draft-handrews-json-schema-hyperschema-02
[Richardson Maturity Model]: https://www.crummy.com/writing/speaking/2008-QCon/act3.html
[JSON API]: https://jsonapi.org/
[Roy Fielding about the opacity of resource identifiers]: https://roy.gbiv.com/untangled/2008/rest-apis-must-be-hypertext-driven
[REST API Design Rulebook, by Mark Masse]: https://learning.oreilly.com/library/view/rest-api-design/9781449317904/
[JSON-LD]: https://json-ld.org/
[Hydra]: http://www.hydra-cg.com/spec/latest/core/
[Roy Fielding keynote on Evolve'13]: https://www.slideshare.net/evolve_conference/201308-fielding-evolve
[IANA list of link relations]: https://www.iana.org/assignments/link-relations/link-relations.xhtml
[PayPal and HATEOAS]: https://developer.paypal.com/docs/api/reference/api-responses/#hateoas-links
[API Change Strategy]: https://nordicapis.com/api-change-strategy/
[RESTful Web Services Cookbook]: https://learning.oreilly.com/library/view/restful-web-services/9780596809140/
