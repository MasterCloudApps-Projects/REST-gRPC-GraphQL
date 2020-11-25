# Contract
This chapter covers how the different API styles let API developers design their interface: which is the recommended approach, what alternatives there are, which Interface Definition Languages can be used, and so on. 

## REST
For a Web API to be called RESTful, it is mandatory that it is hypermedia-based (HATEOAS). This means all their resources can be traversed with no prior knowledge of the URI, but as a succesion of links. This mechanism, that inspired Roy Fielding when creating REST, has been proven succesfully in the World Wide Web: people browse the web as a series of links. However, most _REST APIs_ are not HATEOAS compliant. So, instead of take advantage of hypermedia, very often APIs rely on contracts and rules on how identifiers are built (they are not _opaque_, but _predictable_). These APIs, which are like _resource-based_ RPC, are often called _REST-Like Web Services_. Many people think that, despite being a good idea, [true RESTful market is far from being mature][Why HATEOAS is useless and what that means for REST].

Characteristics of a HATEOAS API:
* ✔️ Evolvability. Client and server don't rely on a bespoke contract, but in open standards.
* ✔️ Discoverability. A client can automatically discover new functionalities provided by the server.
* ✘ Lack of adoption and tooling.
* ✘ Cost. Developing a RESTful Service is expensive.

Let's see each one of these _REST styles_.

### True REST
[According to Roy Fielding][REST APIs must be hypertext-driven]:

> If the engine of application state (and hence the API) is not being driven by hypertext, then it cannot be RESTful and cannot be a REST API. Period.

What this means is that each resouce is somehow connected to other resources, thus creating a graph. If a client application uses that graph as its engine, then that means that the graph is a [_state machine_][Designing a true REST state machine], where each resource/node is a state, and each link/connection is a state transition. Let's think of a microwave oven. When we first get the microwave, its representation might contain an `action` to turn it on:

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

The `actions` property contains a list of possible transitions in a certain hypermedia specification, so that the client only needs to _follow links_. In this case, to turn the microwave on we just need to following the `on` link. This is HATEOAS in action. A client is only required to understand the semantics of each available transition.

Code need not rely on any URI convention. According to [Roy Fielding words][Roy Fielding about the opacity of resource identifiers],

> A REST API should be entered with no prior knowledge beyond the initial URI (bookmark) and set of standardized media types that are appropriate for the intended audience (i.e., expected to be understood by any client that might use the API).

So, technically, all these URI might be completely RESTful:

* https://example.com/books/12
* https://example.com/books?getBook=12
* https://example.com/89110c64-0c83-11eb-adc1-0242ac120002

#### Links specifications

There is no unique medium to express them:

* HTTP: [Web Links (RFC 8288)][] - Send links through the HTTP headers. Apropriate when the representation does not allow links (i.e. an image or a plain text) or when it's required to read links without parsing the body.
* JSON: [JSON API][] (it can descrive links as well), [JSON-LD][], [JSON Hyper-Schema][] (the hypermedia solution of JSON Schema), [HAL (Hypertext Application Language)][] or [Hydra][] (based on JSON-LD).
* XML: [Atom (RFC 5023)][].

Typically, the type of relation in a link is specified in a `rel` field. IANA maintains a [list of standard link relations][IANA list of link relations].

#### About `rel`
Some people (See [RESTful Web Services Cookbook][]) suggest we express the action type in the `rel` following these rules:

* Use the existing names, like `self`, `alternate`, `related`, `previous`, `next`, `first` and `last`.
* If there is no existing name, create a new one. Express that relation as a URI. Also, provide an HTML documentation for that relation at that URI.

#### Real World Examples
Criticisms of HATEOAS often argue that there are no real-world examples of it, which is unfair. One of the most widely-used REST APIs in the world makes use of it: [PayPal][PayPal and HATEOAS]. Here is an example extract from a response:

```json
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

#### Note on Versioning
When it comes to versioning, according to [Roy Fielding keynote on Evolve'13][], the best practice for versioning a REST API is not to version it. REST is already defined as a state machine (HATEOAS) where each state can be dynamic and each transition can be redirected (linked). So instead of agreeing on an interface, to change the state, client software should only need to _follow_ the apropriate links (as we humans do when we use a web). But still, [an API might need updates which break backwards compatibility][API Change Strategy] (like fixing a typo in a schema).

### REST-Like
Although Hypermedia is a very powerful tool, most developers choose a different approach when the consumer of the API is another application that wants to provide its own experience to the final user. Here, URIs are no longer opaque, but constructed by the client. This is often known as _REST-Like_, _so-called REST_ or simply _OpenAPI_, and basically it is a _resource-oriented_ RPC Web API, just like gRPC, but unlike gRPC, in _REST-Like_ the underlying transport protocol, HTTP, is exposed to the client.

The fact that this is not pure REST is not necessarily bad. Actually, this type of API design is so popular that it is the one followed by well-known frameworks like [OpenAPI][], [API Blueprint][] or [RAML][]. And, in spite of the evolvability benefits from an hypermedia-based API, [some people is skeptical about whether we are ready for them][Criticism to HATEOAS].

#### URI Templates and URI design
Even thoguh according to the REST contraints neither the client nor the documentation should rely on a specific URI convention, that does not mean that we cannot follow a convention to (1) make the URIs human-readable, (2) to save design time or (3) to distribute the processing based on our URIs path. It is completely right to use, for example, [URI Templates (RFC 6570)][].

Many of the rules on how to design URIs are opinionated. Still, some have major approval in the community, like the ones presented in [REST API Design Rulebook, by Mark Masse][]:

* Forward slash (`/`): won't be used as the last character of a URI. It is used to specify a hierarchical relationship. This allows for mapping compositions of elements.
* Use hyphens (`-`), and not underscore (`_`), to improve readability.
* Use lowercase.
* Do not include file extensions. Use the HTTP `Accept` header instead.

There is almost a consensus about whether to use plural or singular names:

* **Document** - use a singular noun: `https://example.com/universities/urjc`
* **Collection and store** - use a plural noun: `https://example.com/universities`
* **Controller** - use a verb: `https://example.com/albums/341/play`

#### OpenAPI
OpenAPI is a specification to describe what an HTTP API can do. This is done writing an OpenAPI spec using either Yaml or Json.

* It's standard. So it is well suited for humans, to understand an API, but also for machines: they can render it as an interacive documentation (see [Swagger UI][]) or autogenerate code for us (see [Swagger CodeGen][]).
* Describes the [_paths_][OpenAPI Paths] (endpoints), with the supported _operations_, parameters and resources.
* Can specify [_data models_ using JSON Schema][OpenAPI Data Models].
* Since OpenAPI 3.0, [_links_][OpenAPI Links] are supported, which allows for using the value returned by an _operation_ as the input of another _operation_. Although this is not technically HATEOAS, it's an alternative to [hypermedia][Hypermedia in API design] used in REST.

Example:
This example, taken from the Swagger website, outlines how to add the metainformation of a server, and its path `/users/{userId}`, reachable throuh `GET`:

```yaml
openapi: 3.0.0
info:
  title: Sample API
  description: Optional multiline or single-line description in [CommonMark](http://commonmark.org/help/) or HTML.
  version: 0.1.9
servers:
  - url: http://api.example.com/v1
    description: Optional server description, e.g. Main (production) server
  - url: http://staging-api.example.com
    description: Optional server description, e.g. Internal staging server for testing
paths:
  /users/{userId}:
    get:
      summary: Gets a user by ID
      operationId: getUser
      parameters:
        - in: path
          name: userId
          required: true
          schema:
            type: integer
            format: int64
      responses:
        '200':
          description: A User object
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
components:
  schemas:
    User:
      type: object
      properties:
        id:
          type: integer
          format: int64
          readOnly: true
        name:
          type: string
```

The schema, expressed in JSON Schema, describes how a User object is organized. Then, that schema is referenced from the `200` response of the `getUser` operation. 

## GraphQL
GraphQL contrasts with REST on how easy it is to define the available operations. Three _Operation Types_ are defined (see [methods](methods.md) for more info on what each operation do):

* `query`
* `mutation`
* `subscription`

The [GraphQL Schema Language][] let us specify each of these operations in their own section:

```graphql
{
    type Query {
        myFirstQuery(param: Int): ReturnType
        mySecondQuery(param: Int): OtherReturnType
    }

    type Mutation {
        myFirstMutation(param: FirstMutationInput!): ReturnType
        mySeconMutation(param: SecondMutationInput): OtherReturnType
    }

    type Subscription {
        someTopic: ReturnType
    }
}
```

### Arguments and return values
Each operation acts as an RPC method that accept both arguments and a return value. [Arguments][GraphQL: Operations arguments], which are optional, can be used to for example let a `List` operation filter the results, or a `Get` operation select a specific resource.

In addition to optional input values, every GraphQL operation will return an element. If this element is of any compound type, caller will need to provide the fields it is interested in:

```graphql
query {
    myFirstQuery(param: 12) {
        field1
        field2
    }
}
```

## Resources
* [HATEOAS 101: Opinionated Introduction to a REST API Style](https://www.youtube.com/watch?v=6UXc71O7htc)
* [REST APIs must be hypertext-driven][]
* [Designing a true REST state machine][]
* [API design: Understanding gRPC, OpenAPI and REST and when to use them](https://cloud.google.com/blog/products/api-management/understanding-grpc-openapi-and-rest-and-when-to-use-them)
* [OpenAPI specification][OpenAPI]

[REST APIs must be hypertext-driven]: https://roy.gbiv.com/untangled/2008/rest-apis-must-be-hypertext-driven
[Designing a true REST state machine]: https://nordicapis.com/designing-a-true-rest-state-machine/
[Web Links (RFC 8288)]: https://tools.ietf.org/html/rfc8288
[JSON API]: https://jsonapi.org/
[JSON-LD]: https://json-ld.org/
[JSON Hyper-Schema]: https://tools.ietf.org/html/draft-handrews-json-schema-hyperschema-02
[HAL (Hypertext Application Language)]: https://tools.ietf.org/html/draft-kelly-json-hal-08
[Hydra]: http://www.hydra-cg.com/spec/latest/core/
[Atom (RFC 5023)]: https://tools.ietf.org/html/rfc5023#section-11
[RESTful Web Services Cookbook]: https://learning.oreilly.com/library/view/restful-web-services/9780596809140/
[PayPal and HATEOAS]: https://developer.paypal.com/docs/api/reference/api-responses/#hateoas-links
[Roy Fielding keynote on Evolve'13]: https://www.slideshare.net/evolve_conference/201308-fielding-evolve
[API Change Strategy]: https://nordicapis.com/api-change-strategy/
[IANA list of link relations]: https://www.iana.org/assignments/link-relations/link-relations.xhtml
[Roy Fielding about the opacity of resource identifiers]: https://roy.gbiv.com/untangled/2008/rest-apis-must-be-hypertext-driven
[URI Templates (RFC 6570)]: https://tools.ietf.org/html/rfc6570
[REST API Design Rulebook, by Mark Masse]: https://learning.oreilly.com/library/view/rest-api-design/9781449317904/
[OpenAPI]: https://swagger.io/specification/
[API Blueprint]: https://apiblueprint.org/
[RAML]: https://raml.org/
[Criticism to HATEOAS]: https://www.vinaysahni.com/best-practices-for-a-pragmatic-restful-api#hateoas
[Swagger UI]: https://swagger.io/tools/swagger-ui/
[Swagger Codegen]: https://github.com/swagger-api/swagger-codegen
[OpenAPI Paths]: https://swagger.io/docs/specification/paths-and-operations/
[OpenAPI Data Models]: https://swagger.io/docs/specification/data-models/
[OpenAPI Links]: https://swagger.io/docs/specification/links/
[Hypermedia in API design]: https://smartbear.com/learn/api-design/what-is-hypermedia/
[GraphQL Schema Language]: https://graphql.org/learn/schema/
[GraphQL: Operations arguments]: https://graphql.org/learn/queries/#arguments
