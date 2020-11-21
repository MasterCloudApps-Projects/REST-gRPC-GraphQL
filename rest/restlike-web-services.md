# REST-Like Web Service
The REST constraints we've seen so far lead to several signature characteristics of a truly RESTful service:

* **Identifiers are opaque**. Clients do not construct identifiers from other information.
* **It is entity-oriented**. Unlike RPC, which is procedure-oriented, a RESTful service transfer entities.
* **Clients follow hyperlinks**. Again, unlinke RPC, where a client chooses to query a certain _endpoint_.

Most of the _REST APIs_ out there do not match these characteristics. Instead, they are designed so that clients will operate on remote entities by:

* Creating URIs from templates. Identifiers are not opaque.
* Invoking them. Instead of following an hypermedia.

This type of APIs is often called _REST-Like_, _so-called REST_ or simply _OpenAPI_. Basically, it is a form of _resource-oriented_ RPC over HTTP, just like gRPC, but unlike gRPC, in _REST-Like_ the underlying transport protocol, HTTP, is exposed to the client.

The fact that this is not pure REST is not necesarely bad. Actually, this type of API design is so popular that it is the one followed by well-known frameworks like [OpenAPI][], [API Blueprint][] or [RAML][]. And, in spite of the evolvability benefits from an hypermedia-based API, [some people is skeptical about whether we are ready for them][Criticism to HATEOAS].

## OpenAPI
It's a specification to describe what an HTTP API can do. This is done writing an OpenAPI spec using either Yaml or Json.

* It's standard. So it is well suited for humans, to understand an API, but also for machines: they can render it as an interacive documentation (see [Swagger UI][]) or autogenerate code for us (see [Swagger CodeGen][]).
* Describes the [_paths_][OpenAPI Paths] (endpoints), with the supported _operations_, parameters and resources.
* Can specify [_data models_ using JSON Schema][OpenAPI Data Models].
* Since OpenAPI 3.0, [_links_][OpenAPI Links] are supported, which allows for using the value returned by an _operation_ as the input of another _operation_. Although this is not technically HATEOAS, it's an alternative to [hypermedia][Hypermedia in API design] used in REST.

### Example
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

## Resources
* [API design: Understanding gRPC, OpenAPI and REST and when to use them](https://cloud.google.com/blog/products/api-management/understanding-grpc-openapi-and-rest-and-when-to-use-them)
* [OpenAPI specification][OpenAPI]

[OpenAPI]: https://swagger.io/specification/
[API Blueprint]: https://apiblueprint.org/
[RAML]: https://raml.org/
[Swagger Codegen]: https://github.com/swagger-api/swagger-codegen
[Swagger UI]: https://swagger.io/tools/swagger-ui/
[OpenAPI Links]: https://swagger.io/docs/specification/links/
[Hypermedia in API design]: https://smartbear.com/learn/api-design/what-is-hypermedia/
[Criticism to HATEOAS]: https://www.vinaysahni.com/best-practices-for-a-pragmatic-restful-api#hateoas
[OpenAPI Data Models]: https://swagger.io/docs/specification/data-models/
[OpenAPI Paths]: https://swagger.io/docs/specification/paths-and-operations/
