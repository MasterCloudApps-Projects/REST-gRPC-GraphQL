# Introduction to APIs
Putting it simply, an API, or _Application Progamming Interface_, is a product which allows a   system to be used by an external application.

## Paradigms

### Request-response APIs
* **RPC API**: this is the simplest form, where the API is designed around arbitrary procedures and typically described using an IDL (Interface Definition Language). There are several existing specifications, like SOAP, JSON-RPC or XML-RPC. There is also the [gRPC](../grpc/grpc.md) specification, which also has an official implementation.
* **Web API**: Or [REST](../rest/rest.md). It is an architectural style where the system behaviour is based on transitions of data (or _resources_, as called in HTTP). There is no official implementation.
    * [REST-like](../rest/restlike-web-services.md). A key characteristic of REST is that their clients just _follow_ (or _bookmark_) opaque URIs. When we use a so-called REST API where clients construct URIs, then it is not _pure REST_, but RPC over HTTP. This is often refered as _REST-Like_, _So-called REST_ or [_OpenAPI_][OpenAPI] (because of one of its most popular implementations).
* **Query API**: then we have a query-oriented API, [GraphQL](../graphql/graphql.md). It is esentialy an RPC service, exposing a single entrypoint, that allow clients to run _queries_, using a SQL-like syntax, and make changes through _mutations_.

Very often, we see a clear separation between: _resource-oriented_ and _action-oriented_ APIs:

* **Resource-oriented API**. The API is structured around resource identifiers, _nouns_, and a small set of _operation_ to manipulate them. For example, in a _resource-oriented_ API like REST, to read a user we will use the predefined `GET` method of HTTP on its identifier. This is very useful because it let API users to follow a well-known pattern. When facing a new API, the will already know how to do most operations, like creating or updating a resource.
* **Action-oriented API**. The interface is designed around the actions. RPC fits here, where an _arbitrary method_ is exposed. For example, a custom method `getUser(int id)` can be created. Given the simple nature of RPC, this style is convenient to express whatever operation an API designer wanted to expose. For example: `mergeUsers(int idFrom, int idTo)`.

There are design proposals to converge both approaches. For example, [Google recommends API designers to always follow a _resource-oriented_ style][Google API design Guide: Resource Oriented Design] (even in gRPC) using a predefined set of _standard methods_: `List`, `Get`, `Create`, `Update` and `Delete`. And when an operation does not naturally match any of these, then a _custom method_ can be created.

### Event-Driven APIs
Constantly sending requests to a remote API to find out when something happens might be resource-expensive. According to [some studies][Zapier RESTHooks.org], 1.5% of those API calls returns new data. To prevent this, Event-Driven APIs might be used:

* **Publish-subscribe API**: Kafka or AMQP.
* **WebHooks**: an application subscribes to a topic, and will receive events through an HTTP endpoint. These subscriptions can be done programmatically (for example, in [Microsoft Graph API][Microsoft Graph API subscriptions]) or manually (supported for example in [GitHub][GitHub webhooks]).
* **WebSocket**: programmatically, an application subscribes to a topic and will receive events through a websocket. Used by [GraphQL subscriptions][].
* **HTTP Streaming**: very common back in the day, consists in an open HTTP request which allows the API server to sent data back to the client at will. Used, for example, by [Twitter][Twitter API: Filtered Stream].

## Resources

* 🔗 [Google API design Guide](https://cloud.google.com/apis/design)
* 🔗 [Zdenek talk on API Styles](https://youtu.be/gRZbgsmDj_0)
* 🔗 [Understanding RPC, REST and GraphQL](https://apisyouwonthate.com/blog/understanding-rpc-rest-and-graphql)
* 🔗 [Picking the right API Paradigm](https://apisyouwonthate.com/blog/picking-the-right-api-paradigm)
* 📖 [Designing Web APIs, Chapter 2](https://www.oreilly.com/library/view/designing-web-apis/9781492026914/)

[OpenAPI]: https://swagger.io/specification/
[Google API design Guide: Resource Oriented Design]: https://cloud.google.com/apis/design/resources
[Zapier RESTHooks.org]: https://zapier.com/engineering/introducing-resthooksorg/
[Microsoft Graph API subscriptions]: https://docs.microsoft.com/en-us/graph/api/resources/webhooks?view=graph-rest-1.0
[GitHub webhooks]: https://docs.github.com/en/free-pro-team@latest/developers/webhooks-and-events/creating-webhooks
[GraphQL Subscriptions]: https://graphql.org/blog/subscriptions-in-graphql-and-relay/
[Twitter API: Filtered Stream]: https://developer.twitter.com/en/docs/twitter-api/tweets/filtered-stream/introduction
