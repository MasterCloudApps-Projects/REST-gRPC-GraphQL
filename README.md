# REST, gRPC and GraphQL

## Demo project
See [implementation project](src/)

## Project description
1. [Introduction](docs/apis_introduction.md)
2. [REST](docs/rest.md)
3. [GraphQL](docs/graphql.md)
4. [gRPC](docs/grpc.md)
5. [Comparison](docs/../docs/comparison.md)

### Comparison table

| Usage                              | REST                                                                      | GraphQL                                       | gRPC                                                          |
|------------------------------------|---------------------------------------------------------------------------|-----------------------------------------------|---------------------------------------------------------------|
| [Contract][]                       | HATEOAS or OpenAPI                                                        | GraphQL Schema Language: operations           | Protocol Buffers: rpc                                         |
| [Schema definition][]              | Resource oriented.<br />HTTP response headers, Media Type and JSON Schema | Graph oriented.<br />GraphQL Schema Language  | Resource and Action oriented.<br />Protocol Buffers: messages |
| [Standard methods][]               | `GET`, `POST`, `PUT`, `PATCH`, `DELETE`                                   | `query` and `mutation`                        | Through rpc operations                                        |
| [Get][]                            | `GET`                                                                     | `query`                                       | `Get` rpc operation                                           |
| [Get (representation)][]           | ✔️ Content Negotiation                                                     | ✘ Only JSON                                   | ✘ only one. Default: Protocol Buffers                         |
| [Get (custom)][]                   | Sparse fieldsets. Embedded resources                                      | Native support                                | `FieldMask`                                                   |
| [List][]                           | `GET`. Custom pagination, sorting and filtering                           | `query`. Standard pagination and sorting      | `List` and `Search` rpc operations                            |
| [Create][]                         | `POST` or `PUT`                                                           | `mutation`                                    | `Create` rpc operation                                        |
| [Update][]                         | `PUT`                                                                     | `mutation`                                    | `Update` rpc operation (unrecommended)                        |
| [Partial update][]                 | `PATCH`                                                                   | ✘ Workarounds                                 | `Update` rpc operation with `FieldMask`                       |
| [Delete][]                         | `DELETE`                                                                  | `mutation`                                    | `Delete` rpc operation                                        |
| [Custom methods][]                 | HATEOAS or `POST`                                                         | pure functions: `query`, other: `mutation`    | Custom rpc operation                                          |
| [Long-requests][]                  | Resource `operation`                                                      |                                               | Interface `Operation`                                         |
| [Error handling][]                 | Native in HTTP. Extensible                                                | `errors` property. Extensible                 | Standard errors. Google Error Model                           |
| [Security][]                       | HTTP: Bearer, OAuth, CORS, API Keys                                       | HTTP: Bearer, OAuth, CORS, API Keys           | TLS, ALTS, token-based (Google), custom                       |
| [Subscriptions][]                  | Unsupported. WebHook and HTTP streaming                                   | `subscription`                                | HTTP/2 streaming                                              |
| [Caching][]                        | HTTP, application and local cache                                         | `GET`, application and local cache            | Application and local cache                                   |
| [Discoverability][]                | HATEOAS and `OPTIONS` or OpenAPI                                          | Native introspection                          | ✘ autogenerated client code                                   |


[Contract]: docs/usage/contract.md
[Schema definition]: docs/usage/schema_definition.md
[Standard methods]: docs/usage/methods.md
[Get]: docs/usage/method_get.md
[Get (representation)]: docs/usage/method_get#representation.md
[Get (custom)]: docs/usage/method_get#custom-fetching.md
[List]: docs/usage/method_list.md
[Create]: docs/usage/method_create.md
[Update]: docs/usage/method_update.md
[Partial update]: docs/usage/method_update_partial.md
[Delete]: docs/usage/method_delete.md
[Custom methods]: docs/usage/method_custom.md
[Long-requests]: docs/usage/asynchronous_operation.md
[Error handling]: docs/usage/error_handling.md
[Security]: docs/usage/security.md
[Subscriptions]: docs/usage/subscriptions.md
[Caching]: docs/usage/caching.md
[Discoverability]: docs/usage/discoverability.md
