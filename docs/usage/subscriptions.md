# Subscriptions
Request-Response APIs are convenient to let clients request data. However, this might be very resource-intensive. When we face these scaling problems, event-driven mechanisms can be used.

## REST
RESTful Web Services by definition cannot maintain an open, stateful connection to a client. However, a number of side solutions have been built around REST-Like Web Services to provide an event-based Web API.

### WebHook
The most popular approach is using WebHooks. This is simply a mechanism to let client subscribe to events by registering a callback URI. Whenever a certain event happens, the callback URI will be invoked. For example, a blog might let their API users subscribe to events, so that whenever _something_ happens (a new article has been published or a comment has been written), the server will call each of the registered HTTP callbacks.

Sometimes, this is done manually in the developers console of each service provider, for example in GitHub or in WeChat APIs. Other service providers let developers manage programmatically their webhooks; this is supported for example by GitHub and by Microsoft Graph API.

WebHooks can also be:
* **global**: callback URLs will receive every event their application is authorized to.
* **topic-based**: the webhook URL will be called only under certain events. For example, notify only events of the topic `orders/create`. Used by [Shopify][Shopify Webhooks].
* **parameterized**: the developer is able to set parameters to select only certain notification events of the topic they are interested in. For example, to receive calendar notifications of a specific users. Used by [Microsoft Graph API][Microsoft Graph API Webhooks].

This call to the webhook could be:
* just an event, so that the application would need to make further requests in case it wants more information.
* A resource, containing for example the current snapshot of the resource where the event happened.

The overall design of the WebHook will depend of how the applications of the Web Service will consume that information. Give the nature of this technology, it is used to create an event-based API for servers.

### Long polling and HTTP Streaming
Long polling is a technique that consists in keeping an open TCP connection between the HTTP client and the server, so that the server can decide when to respond to the client. When the server responds, a new TCP connection is opened by the client.

HTTP Streaming is quite similar: the client opens an HTTP connection to the server using a special header, `Transfer-Encoding: chunked` ([the response will come in a series of chunks][Transfer Encoding in MDN]).

> Note: [HTTP/2 does not support `chunked`][HTTP/2 (RFC 7540)] anymore, as it has its own mechanism `stream` mechanism which support concurrent streaming connections.

These techniques, in contrast to WebHooks, can be used to let HTTP clients be notified of events. For example, HTTP streaming is used by [Twitter][Twitter API: Filtered Stream] in their API to Filtered Streams.

## GraphQL
GraphQL natively supports a custom operation called [_subscription_][Subscriptions in GraphQL and Relay] that let a client application subscribe to a certain event. This will open a session, using the [WebSocket Protocol (RFC 6455)][], between the server and the client app.

Subscriptions, like the rest of GraphQL root types, accepts parameters. These can be used to let app clients specify not just the topic they are interested in, but also to filter specific events of that topic.

And as with the rest of GraphQL operations, when using a _subscription_ the client can specify the shape of the received payload.

For example, the following code can be used by a client app to subscribe to messages of type `newProduct`, filtering those that are of the specified type, and receiving only the `id` and the `name` of the new product:

```graphql
subscription($productType: String!){
    newProduct(productType: $productType) {
        id
        name
    }
}
```

## gRPC
Protocol Buffers implements a very powerful service definition, which allows for streaming from and to the client application, where each _method_ (`rpc`) can be of any of the following types (example stubs taken from [grpc.io](https://grpc.io/docs/what-is-grpc/core-concepts/))):

* **Unary** - a regular request-response request:

    ```proto
    rpc SayHello(HelloRequest) returns (HelloResponse);
    ```

* **Server streaming** - the client will receive a _stream_ from the server, as in the HTTP streaming technique above.

    ```proto
    rpc LotsOfReplies(HelloRequest) returns (stream HelloResponse);
    ```

* **Client streaming** - the server will receive a _stream_ from the client.

    ```proto
    rpc LotsOfGreetings(stream HelloRequest) returns (HelloResponse);
    ```

* **Bidirectional streaming** - both ends will receive a _stream_ from each other.

    ```proto
    rpc BidirectionalHello(stream HelloRequest) returns (stream HelloResponse);
    ```

An rpc with a `stream` response will allow to create a _subscription_ to a topic. This mimics the [HTTP/2 stream connections][HTTP/2 (RFC 7540)].

## Source code
For this, any publish-subscribe solutions can be used, like [Kafka](https://kafka.apache.org/), [RabbitMQ](https://www.rabbitmq.com/) or [Redis Pub/Sub](https://redis.io/topics/pubsub). Here, we will be using a basic in-memory publish-subscribe implementation provided by Apollo Server, the GraphQL framework.

A simple subscription for _new articles_ has been created. Every API is able to react to _new articles_ regardless of where they were originated.

### REST
TODO

### GraphQL
Apollo Server, one of the most popular GraphQL implementations, [support subscriptions out of the box][Apollo Server: Subscriptions]. A `publish-subscribe` service should be used within the server to let mutations notify the subscribers.

The sample project has been implemented using the Apollo Server middleware for Express and supports subscriptions. To run this test, we will need a client application able to use webSockets. Let's open the GraphiQL interface in http://localhost:4000/graphql.

To create a subscription, run:

```graphql
subscription {
    newArticle {
        title
    }
}
```

Now, to create an article open the GraphiQL interface in another tab and create a new article:

```graphql
mutation {
    createArticle(article:{title:"TITLE",description:"DESCRIPTION"}) {
        title
    }
}
```

The first GraphiQL, which is subscribed to `newArticle` events, would have receive the message, as in:

```json
{
    "data": {
        "newArticle": {
            "title": "TITLE"
        }
    }
}
```

### gRPC
Since gRPC natively supports streams, we can leverage them to provide subscriptions.

The sample project contains an endpoint to provide streaming for new articles. To create a subscription, start up the project (`npm start`) and the gRPC client (`npm run grpcc`) and then run:

```js
client.listNewArticles({}).on('data', sr).on('status', sr);
```

This will create a new request to the `listNewArticles` rpc (that accepts an empty object). Then, it creates two handlers:

* `data`, that is called whenever a new data is received. The builtin `sr` (shorthand of `streamReply`) function will be called, which will output the received data.
* `status`, that is invoked whenever the status of the requests changes, for example because it has finished. Again, the builtin `sr` function will be called.

Now, to check how it works, we just need to create a new article. Note that it can be created from GraphQL as well. The new object will be displayed in the client gRPC application:

```
Main@127.0.0.1:50051>
{
  "id": "5fd4d9230c6f4323c5321e98",
  "title": "This is the title",
  "description": "This is the description",
  "comments": []
}
```

## Resources
* [Transfer Encoding in MDN][]
* [StackOverflow question about different push technologies in the Web](https://stackoverflow.com/questions/12555043/my-understanding-of-http-polling-long-polling-http-streaming-and-websockets)
* [Shopify Webhooks][]
* [Microsoft Graph API Webhooks][]
* [Twitter API: Filtered Stream][]
* [Subscriptions in GraphQL and Relay][]
* [Apollo Server: Subscriptions][]
* [Server Push in HTTP glossary](https://stackoverflow.com/a/14711517)

[Transfer Encoding in MDN]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Transfer-Encoding
[HTTP/2 (RFC 7540)]: https://tools.ietf.org/html/rfc7540
[Shopify Webhooks]: https://shopify.dev/docs/admin-api/rest/reference/events/webhook
[Microsoft Graph API Webhooks]: https://docs.microsoft.com/en-us/graph/api/resources/webhooks?view=graph-rest-1.0
[Twitter API: Filtered Stream]: https://developer.twitter.com/en/docs/twitter-api/tweets/filtered-stream/introduction
[Subscriptions in GraphQL and Relay]: https://graphql.org/blog/subscriptions-in-graphql-and-relay/
[Apollo Server: Subscriptions]: https://www.apollographql.com/docs/apollo-server/data/subscriptions/
[WebSocket Protocol (RFC 6455)]: https://tools.ietf.org/html/rfc6455
