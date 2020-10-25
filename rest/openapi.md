# OpenAPI
Hablar de que OpenAPI técnicamente no es REST, pues:

* las URLs no son opacas, sino que los clientes conocen de antemano cómo construir URLs a recursos.
* los clientes atacan directamente a un endpoint (como en RPC, sin seguir un hyperlink), al que, como puse arriba, proporcionan los parámetros. En RPC el endpoint es un procedimiento y en OpenAPI un recurso, pero se parece mucho.

Esto no es necesariamente malo; pero no es REST. Leer https://cloud.google.com/blog/products/api-management/understanding-grpc-openapi-and-rest-and-when-to-use-them-

La mayoría de APIs "REST" que existen son de este tipo.

Some specifications, like OpenAPI Specification, reduces the network traffic because there is no inspection needed.
