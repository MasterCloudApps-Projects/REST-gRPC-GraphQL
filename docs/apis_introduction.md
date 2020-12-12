# Introduction to APIs
Putting it simply, an API, or _Application Programming Interface_, is a _language_ which allows two systems to talk to each other through the network. We use them constantly, when browsing the Internet or when using a mobile application. For example, they let the Twitter application interact with the Twitter server to read and publish tweets. [Some people](https://www.youtube.com/watch?v=_nAfNxhzJy0) even say that for a service to be considered an API, it also needs to be _reusable_.

APIs are so important that many business, like [Twilio](https://www.twilio.com/), are completely based on their API. This leads to very trendy topic: [API Management](https://www.redhat.com/en/topics/api/what-is-api-management), the process to improve the adoption and engagement of an API.

## Paradigms
In addition to providing a good value, API needs to be designed to effectively solve the requirements of their users or customers. This issue is addressed by picking the right API style. In order to classify each API style, let's first introduce some paradigms.

### Consumers
Not every API is intended for the same audience:

* **Public APIs**: these are publicly available to third-parties. Sometimes, they will require a registration.
* **Private APIs**: in contrast, private APIs are only available to services within a company.

### Request-response APIs
* **RPC API**: this is the simplest form, where the API is designed around arbitrary procedures and typically described using an IDL (Interface Definition Language). There are several existing specifications, like SOAP, JSON-RPC or XML-RPC. Currently, [Apache Thrift](https://thrift.apache.org/) and [gRPC](grpc.md) specifications are very popular, both of them containing official implementations.
* **Web API**: Or [REST](rest.md). It is an architectural style where the system behavior is based on transitions of data (or _resources_, as called in HTTP). There is no official implementation.
    * REST-like. A key characteristic of REST is that their clients just _follow_ (or _bookmark_) opaque URIs. When we use a so-called REST API where clients construct URIs, then it is not _pure REST_, but RPC over HTTP. This is often referred as _REST-Like_.
* **Query API**: in addition to the styles above, we also have query APIs, like [GraphQL](graphql.md). It is essentially an RPC API, exposing a single service, that allow clients to run _queries_, using a SQL-like syntax, and make changes through _mutations_. Its state is represented in form of graph.

### Event-Driven APIs
Constantly sending requests to a remote API to find out when something happens might be resource-expensive. According to [some studies][Zapier RESTHooks.org], 1.5% of those API calls returns new data. To prevent this, Event-Driven APIs might be used:

* **Publish-subscribe API**: Kafka or AMQP.
* **WebHooks**: an application subscribes to a topic, and will receive events through an HTTP endpoint. These subscriptions can be done programmatically (for example, in [Microsoft Graph API][Microsoft Graph API subscriptions]) or manually (supported for example in [GitHub][GitHub webhooks]).
* **WebSocket**: programmatically, an application subscribes to a topic and will receive events through a websocket. Used by [GraphQL subscriptions][].
* **HTTP Streaming**: very common back in the day, consists in an open HTTP request which allows the API server to sent data back to the client at will. Used, for example, by [Twitter][Twitter API: Filtered Stream].

### Resource or action oriented
Very often, we see a clear separation between: _resource-oriented_ and _action-oriented_ APIs:

* **Resource-oriented API**. The API is structured around resource identifiers, _nouns_, and a small set of _operation_ to manipulate them. For example, in a _resource-oriented_ API like REST, to read a user we will use the predefined `GET` method of HTTP on its identifier. This is very useful because it let API users to follow a well-known pattern. When facing a new API, they will already know how to do most operations, like creating or updating a resource.
* **Action-oriented API**. The interface is designed around the actions. RPC fits here, where an _arbitrary method_ is exposed. For example, a custom method `getUser(int id)` can be created. Given the simple nature of RPC, this style is convenient to express whatever operation an API designer wanted to expose. For example: `mergeUsers(int idFrom, int idTo)`.

There are design proposals to converge both approaches. For example, [Google recommends API designers to always follow a _resource-oriented_ style][Google API design Guide: Resource Oriented Design], even in RPC APIs like gRPC, using a predefined set of _standard methods_: `List`, `Get`, `Create`, `Update` and `Delete`. And when an operation does not naturally match any of these, then a _custom method_ can be created.

## REST, gRPC and GraphQL
This project is focused on three specific styles of request-response APIs:

1. a WEB API style: REST, an architectural style with no official implementation that leverages all HTTP capabilities.
2. an RPC style: gRPC, an implementation with no standard, developed by Google and with support for many languages.
3. a query API: GraphQL, a framework developed by Facebook that can be used on any programming language.

They have been chosen because of their maturity, adoption and popularity. The [Software Architecture and Design InfoQ Trends Report of April 2020], an opinionated report measuring the adoption of trends and technologies, places GraphQL and gRPC as technologies that have already _crossed the chasm_, reaching to the _early majority_, whereas REST fits into the _late majority_ category.

## Resources

* 👤 [Zdenek "Z" Nemec](https://twitter.com/zdne)
* 👤 [Erik Wilde](https://twitter.com/dret) [YouTube](https://www.youtube.com/channel/UCDD75qoXHJSz4pv0o3WcTUw)
* 🔗 [Nordic APIs](https://nordicapis.com/)
* 🔗 [Google API design Guide](https://cloud.google.com/apis/design)
* 🔗 [Zdenek talk on API Styles](https://youtu.be/gRZbgsmDj_0)
* 🔗 [Understanding RPC, REST and GraphQL](https://apisyouwonthate.com/blog/understanding-rpc-rest-and-graphql)
* 🔗 [Picking the right API Paradigm](https://apisyouwonthate.com/blog/picking-the-right-api-paradigm)
* 📖 [Designing Web APIs, Chapter 2](https://www.oreilly.com/library/view/designing-web-apis/9781492026914/)
* 🔗 [An Expert’s Guide to Choosing the Right API Style](https://nordicapis.com/an-experts-guide-to-choosing-the-right-api-style/)
* 🔗 [GraphQL vs REST: Overview](https://phil.tech/2017/graphql-vs-rest-overview/)
* 🔗 [REST vs. GraphQL: A Critical Review, by Zdenek "Z" Nemec](https://goodapi.co/blog/rest-vs-graphql)
* 🔗 [API design: Understanding gRPC, OpenAPI and REST and when to use them](https://cloud.google.com/blog/products/api-management/understanding-grpc-openapi-and-rest-and-when-to-use-them)
* 🔗 [REST vs. gRPC: Battle of the APIs](https://code.tutsplus.com/tutorials/rest-vs-grpc-battle-of-the-apis--cms-30711)
* 🔗 [When to Use What: REST, GraphQL, Webhooks, & gRPC](https://nordicapis.com/when-to-use-what-rest-graphql-webhooks-grpc/)
* 🔗 [Comparing API Architectural Styles: SOAP vs REST vs GraphQL vs RPC](https://www.altexsoft.com/blog/soap-vs-rest-vs-graphql-vs-rpc/)

[OpenAPI]: https://swagger.io/specification/
[Google API design Guide: Resource Oriented Design]: https://cloud.google.com/apis/design/resources
[Zapier RESTHooks.org]: https://zapier.com/engineering/introducing-resthooksorg/
[Microsoft Graph API subscriptions]: https://docs.microsoft.com/en-us/graph/api/resources/webhooks?view=graph-rest-1.0
[GitHub webhooks]: https://docs.github.com/en/free-pro-team@latest/developers/webhooks-and-events/creating-webhooks
[GraphQL Subscriptions]: https://graphql.org/blog/subscriptions-in-graphql-and-relay/
[Twitter API: Filtered Stream]: https://developer.twitter.com/en/docs/twitter-api/tweets/filtered-stream/introduction
[Software Architecture and Design InfoQ Trends Report of April 2020]: https://www.infoq.com/articles/architecture-trends-2020/
