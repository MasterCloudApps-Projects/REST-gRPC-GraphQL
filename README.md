# REST-gRPC-GraphQL

[Paradigms](https://youtu.be/gRZbgsmDj_0?t=97):
* **Query API**: [GraphQL](./graphql/graphql.md)
* **Publish-subscribe API**: Kafka, AMQP or WebSub.
* **Web API**: [REST](./rest/rest.md) and also [REST-like](./rest/restlike-web-services.md). System behaviour is based on transitions of data (resources, as called in HTTP).
* **RPC API**: [gRPC](./grpc/grpc.md), JSON-RPC, SOAP or XML-RPC. We expose functions instead of data. For example, `getAllDogs` instead of `GET /dogs`.
* **Flat File**: just hand over a file via email or FTP. Sometimes, this is the best.
