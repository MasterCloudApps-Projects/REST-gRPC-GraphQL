# REST-gRPC-GraphQL

[Paradigms](https://youtu.be/gRZbgsmDj_0?t=97):
* **Query API**: [GraphQL](./graphql/graphql.md)
* **Publish-subscribe API**: Kafka, AMQP or WebSub.
* **Web API**: [REST](./rest/rest.md) and also [REST-like](./rest/restlike-web-services.md). System behaviour is based on transitions of data (resources, as called in HTTP).
* **RPC API**: [gRPC](./grpc/grpc.md), JSON-RPC, SOAP or XML-RPC. We expose functions instead of data. For example, `getAllDogs` instead of `GET /dogs`.
* **Flat File**: just hand over a file via email or FTP. Sometimes, this is the best.


[Aquí cuentan otra forma te categorizar: "request-response APIs" vs "event-driven APIs"](https://learning.oreilly.com/library/view/designing-web-apis/9781492026914/ch02.html):
* Event-Driven
  * WebHooks
  * WebSockets
  * HTTP streaming (descarga infinita). Twitter usa esto https://developer.twitter.com/en/docs/twitter-api/v1/tweets/filter-realtime/guides/connecting

Notas rápidas sobre diferencias REST y graphQL
* REST tiene muchos endpoints HTTP (visibilidad), mientras que graphQL tiene uno.
* REST explota los métodos de HTTP, mientras graphQL usa GET y POST (pero casi siempre funciona solo con POST).
* REST puede usar cualquier representación (custom, XML, JSON, CSV), mientras que graphql usa JSON.
* Ambos son stateless e independientes del lenguaje/fw.
* 

Leer a fondo:

* https://cloud.google.com/files/apigee/apigee-web-api-design-the-missing-link-ebook.pdf
* OData: estándar de Ms. Permite filtrar, embeber, seleccionar fields... https://docs.microsoft.com/en-us/odata/concepts/queryoptions-overview. JSON:API también lo permite: https://jsonapi.org/format/#fetching-sparse-fieldsets
* [Artículo de Zdenek "Z" Nemec comparandp REST, REST-Like y GraphQL](https://goodapi.co/blog/rest-vs-graphql)
* [Artículo de Google Cloud comparando REST, REST-Like y gRPC](https://cloud.google.com/blog/products/api-management/understanding-grpc-openapi-and-rest-and-when-to-use-them)
