# REST-Like Web Service
The REST constraints we've seen so far lead to several signature characteristics of a truly RESTful service:

* **Identifiers are opaque**. Clients do not construct identifiers from other information.
* **It is entity-oriented**. Unlike RPC, which is procedure-oriented, a RESTful service transfer entities.
* **Clients follow hyperlinks**. Again, unlinke RPC, where a client chooses to query a certain _endpoint_.


Hablar de que OpenAPI o API Blueprint técnicamente no son REST.

* No promueven la evolución. Un cambio en la descripción puede hacer que un cliente deje de funcionar.

* las URLs no son opacas, sino que los clientes conocen de antemano cómo construir URLs a recursos.
* los clientes atacan directamente a un endpoint (como en RPC, sin seguir un hyperlink), al que, como puse arriba, proporcionan los parámetros. En RPC el endpoint es un procedimiento y en OpenAPI un recurso, pero se parece mucho.

Esto no es necesariamente malo; pero no es REST. Leer https://cloud.google.com/blog/products/api-management/understanding-grpc-openapi-and-rest-and-when-to-use-them-

La mayoría de APIs "REST" que existen son de este tipo.

Some specifications, like OpenAPI Specification, reduces the network traffic because there is no inspection needed.
