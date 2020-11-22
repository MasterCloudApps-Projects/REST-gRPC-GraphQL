# gRPC
Google suggests gRPC endpoints follow its guide, where they encourage developers to create their APIs resource-oriented: https://cloud.google.com/apis/design/resources.

Since gRPC does not expose the internals of HTTP, [one key benefit from gRPC over REST][Comparison between REST/REST-Like and gRPC] is that API designers do not need to deal with the complexities of how to effectively map an operation to an HTTP verb.

It also benefits from using efficiently the network resources, as it leverages HTTP/2 and sends a binary payload (protobuf). Of course, a REST API can also be run over HTTP/2 and send binary data, but that would mean more development effort from the server and client perspective.

TODO: document downsides: https://cloud.google.com/blog/products/api-management/understanding-grpc-openapi-and-rest-and-when-to-use-them

## Resources
* [Comparison between REST/REST-Like and gRPC][]

[Comparison between REST/REST-Like and gRPC]: https://cloud.google.com/blog/products/api-management/understanding-grpc-openapi-and-rest-and-when-to-use-them
