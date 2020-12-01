# gRPC
[gRPC][], a [Cloud Native Computing Foundation (CNCF)][CNCF] project, is a complete RPC framework originally created by Google in 2015. By default, it works on top of HTTP/2 and uses [Protocol Buffers][] as its Interface Definition Language and serialization mechanism, but can work with other transport protocols or schemas.

It can run on any environment, as it comes with native support for most modern programming languages. It can even work on [browsers](https://github.com/grpc/grpc-web).

## HTTP/2
gRPC main abstraction is the _channel_. A channel represents a gRPC connection between a client and a server, and is basically an HTTP/2 connection. This is fundamental, as thanks to [HTTP/2][HTTP/2: Smarter at scale], gRPC natively supports concurrent, bidirectional persistent connections.

HTTP/2 takes the concept of persistent connection to the next level creating a new abstraction: _streams_, which are a series of related messages (called _frames_). There are two types of streams:

* **Short-lived** - also known as unary streams, as in a traditional request-response architecture.
* **Long-lived** - they keep a persistent connection, either from or to the client, that use the network resources more efficiently by allowing concurrent stream messages.

In gRPC, each `rpc` (_endpoint_), either _unary_ or _long-lived_, has its own stream, making a total of 4 possible `rpc` types:

* **Unary** - As a `GET` in REST.
* **Server streaming** - Similar to _unary_, but a stream of messages are sent back to the client.
* **Client streaming** - As a _unary_, but a stream of messages are sent from the client to the server. Typically the server will send its message when the client is done.
* **Bidirectional streaming** - Initiated by the client, creates two independent streams.

## Protocol Buffers
As defined by Google, _Protocol buffers are a language-neutral, platform-neutral extensible mechanism for serializing structured data._ They allow for service definition, as an IDL, as well as a strongly-typed payload definition. This is helpful to make an efficient usage of the network, because messages are serialized to binary format.

## Resource and action oriented
As any RPC style, a gRPC API can be defined using either a _resource-oriented_ or an _action-oriented_ approach. However, it is [recommended following an _action-oriented_ approach](https://cloud.google.com/apis/design/resources), so that it can easily be mapped as a REST (see [gRPC Transcoding](https://github.com/googleapis/googleapis/blob/master/google/api/http.proto)).

## External resources
* [gRPC Main Page][gRPC]
* [Protocol Buffers][]
* [HTTP/2: Smarter at scale][]
* [gRPC over HTTP2](https://github.com/grpc/grpc/blob/master/doc/PROTOCOL-HTTP2.md)

[gRPC]: https://grpc.io/
[CNCF]: https://www.cncf.io/
[Protocol Buffers]: https://developers.google.com/protocol-buffers
[HTTP/2: Smarter at scale]: https://www.cncf.io/blog/2018/07/03/http-2-smarter-at-scale/
