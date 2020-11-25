# Schema Definition
Protobuf en gRPC, types en GraphQL y libre en REST (JSON Schema es una opción)

## REST
_self-descriptive messages_ constraint states that we need each message to be self-descriptive; this comprehends the payload as well as the metadata.

In _RESTful Web Services_, we rely on HTTP to specify the metadata:

* [`Content-Type`][]: the Media Type plus a charset. This is also used to let clients specify the desired representation.
* [`Last-Modified`][]: last modification date and time of a resource.
* [`Content-Encoding`][]: compression method: `gzip`, `compress`, `deflate`, `identity`, `br`...
* [`Content-Length`][]: size in bytes of the body.
* [`Content-Language`][]: describes the language intended for the audience.

To choose the apropriate representation of the payload, the `Content-Type` entity header will be used. See the [IANA document on Media-Types][] to check a comprehensive list of Media Types approved by the IANA. For example, `text/plain` or `image/png`. An extensible format, like `application/xml` or `application/json` can be used as well. Even a binary representation as [Protobuf can be used in REST][Protobuf and REST].

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

Let's see an example from the JSON Schema documentation:

```json
{
    "$id": "https://example.com/person.schema.json",
    "$schema": "http://json-schema.org/draft-07/schema#",
    "title": "Person",
    "type": "object",
    "properties": {
        "firstName": {
            "type": "string",
            "description": "The person's first name."
        },
        "lastName": {
            "type": "string",
            "description": "The person's last name."
        },
        "age": {
            "description": "Age in years which must be equal to or greater than zero.",
            "type": "integer",
            "minimum": 0
        }
    }
}
```

An object _implementing_ the `Person` schema could look like this:

```json
{
    "firstName": "John",
    "lastName": "Doe",
    "age": 21
}
```

## GraphQL
Defining an schema using a graph is with no doubt GraphQL trademark. As the [official documentation states][GraphQL: Thinking in Graphs]:

> With GraphQL, you model your business domain as a graph

This resembles the mindmap most object-oriented developers follow, in which a business is modeled as a set of objects of their domain.

Then, GraphQL let API designers express their schema using a reduced yet powerful number of primitives in the [GraphQL Schema Language]:

### Scalar types
Are used to define field types of `Object types` and opreation arguments. This type comprehends:
* `Int`
* `Float`
* `String`
* `Boolean`
* `ID`. Represents an identifier.

Note: most GraphQL implementations let developers define their own new scalar types.

### Enumeration type
Allow to create a restricted list of values in a field:

```graphql
{
    enum STATUS {
        READY,
        WAITING,
        RUNNING,
        TERMINATED
    }
}
```

### Object type
Defines a structure, which is made up of other types. A field can be set as mandatory using the `!` symbol. Otherwise, it would be nullable:

```graphql
{
    type Article {
        id: ID!
        title: String!
        author: User!
        thumbnail: String
        comments: [Comment!]
    }
}
```

`Object types` can also make use of `Interface types`:

```graphql
{
    interface Page {
        id: ID!
        title: String!
    }
    type Article implements Page {
        id: ID!
        title: String!
        author: User!
        thumbnail: String
        comments: [Comment!]
    }
}
```

Every field in the interface needs to be redefined. Interfaces are useful when an operation can return different types all of them implementing the same interface. In addition to intefaces, an operation can also be based on `union types`:

```graphql
{
    union SearchResult = Professor | Student
}
```

### Input type
Finally, GraphQL allows to define object types expected to be used as the input of an operation. These are used, for example, to provide an _input object_ to create it in the system. To define an `input type`, we will follow the same syntaxt we used for regular `object types`:

```graphql
{
    input ArticleInput {
        title: String!
        body: String!
        author: Person!
    }
}
```

## Source Code

[`Content-Type`]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type
[`Last-Modified`]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Last-Modified
[`Content-Encoding`]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Encoding
[`Content-Length`]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Length
[`Content-Language`]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Language
[IANA document on Media-Types]: https://www.iana.org/assignments/media-types/media-types.xhtml
[Protobuf and REST]: https://medium.com/swlh/supercharge-your-rest-apis-with-protobuf-b38d3d7a28d3
[JSON Schema]: https://tools.ietf.org/html/draft-handrews-json-schema-02
[JSON API]: https://jsonapi.org/
[GitHub custom Media Types]: https://docs.github.com/en/free-pro-team@latest/rest/overview/media-types
[Minting new Media Types should be avoided]: http://duncan-cragg.org/blog/post/minting-media-types-usually-less-restful-using-raw/
[GraphQL: Thinking in Graphs]: https://graphql.org/learn/thinking-in-graphs/
[GraphQL Schema Language]: https://graphql.org/learn/schema/
