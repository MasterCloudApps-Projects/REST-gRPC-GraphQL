# REST, gRPC and GraphQL

1. [Introduction](apis_introduction.md)
2. [REST](rest.md)
3. [GraphQL](graphql.md)
4. [gRPC](grpc.md)
5. Usage cases:

| Usage                 | REST                                                                 | GraphQL                                  | gRPC                                                     |
|-----------------------|----------------------------------------------------------------------|------------------------------------------|----------------------------------------------------------|
| [Contract][]          | HATEOAS or OpenAPI                                                   | GraphQL Schema Language: operations      | Protocol Buffers: rpc                                    |
| [Schema definition][] | Resource oriented. HTTP response headers, Media Type and JSON Schema | Graph oriented. GraphQL Schema Language  | Resource and Action oriented. Protocol Buffers: messages |

    * [Standard methods](usage/methods.md)
      * [Fetch document](usage/method_get.md)
      * [Fetch collection](usage/method_list.md)
      * [Create document](usage/method_create.md)
      * [Update document](usage/method_update.md)
      * [Partial update](usage/method_update_partial.md)
      * [Delete document](usage/method_delete.md)
    * [Custom methods](usage/method_custom.md)
    * [Asynchronous operation](usage/asynchronous_operation.md)
    * [Error handling](usage/error_handling.md)
    * [Security](usage/security.md)
    * [Subscriptions](usage/subscriptions.md)
    * [Caching](usage/caching.md)
    * [Discoverability](usage/discoverability.md)

[Contract]: usage/contract.md
[Schema definition]: usage/schema_definition.md
