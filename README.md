# REST-gRPC-GraphQL



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
