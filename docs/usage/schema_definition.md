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

Let's see an example from the JSON Schema (the language used to describe schemas in OpenAPI) documentation:

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

Each field in a type can optionally accept arguments. They can be used to for example customize the representation of a resource, to limit the response, or to filter a result:

```graphql
{
    type Article {
        id: ID!
        title: String!
        date(format: DateFormats = ISO8601): String!
        author: User!
        thumbnail: String
        comments(limit: Int = 20, offset: Int = 0): [Comment!]
    }
}
```

Here we are leting the client application specify how it want the date to be represented (let's assume `DateFormats` is an existing Enumeration Type), with a default format `ISO8601`. They can also paginate the returned `comments`.

### Union type
Union types indicates a list of various possible types. When a union type is used as a field, any of its concrete types may be used:

```graphql
{
    union SearchResult = Professor | Student | Subject
}
```

If a query returns an array `SearchResult`, we can specify fields for each type, as in:

```graphql
{
    search(keyword: "Smith")  {
        __typename
        ... on Professor {
            name
            lastname
        }
        ... on Student {
            name
            lastname
        }
        ... on Subject {
            name
        }
    }
}
```

### Interface type

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

## gRPC
Although gRPC can be used with any extensible language, such as JSON, most of the time it uses [Protocol Buffers](https://developers.google.com/protocol-buffers/docs/overview) to define the schema of its entites. It consists in a platform-agnostic language for serializing data, toghether with a [compiler](https://developers.google.com/protocol-buffers/docs/proto3#generating) to generate language-specific code out from the schema definition. To define a schema, a `.proto` file will be used.

There are several versions of Protocol Buffers. Here, we will cover [proto3](https://developers.google.com/protocol-buffers/docs/proto3) version, specifying it in the first line of the `.proto` file, as in:

```proto
syntax = "proto3";
```

### Scalar types
Up to [15 scalar types](https://developers.google.com/protocol-buffers/docs/proto3#scalar) are accepted, with transport concerns to take into consideration. For the sake of simplicity, only a couple of them, with their Java equivalent, are enumerated here:

| .proto type | Java type |
|-------------|-----------|
| double      | double    |
| float       | float     |
| int32       | int       |
| int64       | long      |
| bool        | boolean   |
| string      | String    |

### Enumeration type
Enumeration types can be used to restrict the allowed values:

```proto
enum Status {
    READY = 0;
    WAITING = 1;
    RUNNING = 2;
    TERMINATED = 3;
}
```
### Message type
Finally, to define a composite type, we can use the Message type:

```proto
syntax = "proto3";

message Article {
    int32 id = 1;
    string title = 2;
    User author = 3;
    string thumbnail = 4;
    repeated Comment comment = 5;
}
```

There are several things to note:

* **Field Rules**: message fields can be either: (1) _singular_, the default; or (2) `repeated`, an ordered list of elements.
* **Field numbers**: each field is _identified_ with a unique number. If a message is updated and a field is remover, its field number should be marked as forbidden using the [`reserved` statement](https://developers.google.com/protocol-buffers/docs/proto3#reserved).

### Any message type
[`Any`](https://developers.google.com/protocol-buffers/docs/proto3#any) adds support to embed a field of an unknown type. For example, our API might have an _abstract_ `Operation` message type as a response to any requested operation. The `Operation` message might have a concret `status` field, plus a `response` field of type `Any`:

```proto
import "google/protobuf/any.proto";

message Operation {
    int32 id = 1;
    Status status = 2;
    google.protobuf.Any response = 3;
}
```

Note we need to import `google/protobuf/any.proto` in order to use it.

### Oneof message type
Similar to [GraphQL Union Type](#union-type), and sometimes referred to as _union fields_, [`Oneof`](https://developers.google.com/protocol-buffers/docs/proto3#oneof) allows to ser a list of possible fields where at most one of them will be specified. For example, if a request can result in either `OK` or failed, the result might contain a `result` field of type `Oneof` with two possible fields:

* `response` - with the response, when the request was successfully run. For example, of type `Any`.
* `error` - with an object representing the error, in case of any failure.

Which might result in something like this:

```proto
import "google/protobuf/any.proto";

message Operation {
    int32 id = 1;
    Status status = 2;
    oneof result {
        google.protobuf.Any response = 3;
        Error error = 4;
    }
}
```

There is much more with regard to Protocol Buffers:
* **Nested types**: we can define a Message or an Enumeration type within another message declaration.
* **Importing definitions**: a `.proto` file can reference another `.proto` file to import its definitions. This is not supported in Java.
* **Maps**: we can create hash tables, to map a `key_type` to a `value_type`.

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
