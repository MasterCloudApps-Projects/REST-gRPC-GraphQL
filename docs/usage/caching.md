# Caching
Caching is a mechanism that allow applications to improve how well they perform by minimizing the accesses to frequently-used resources. Caches can be in the backend, in the client application or even somewhere between them. Let's see how each API style takes advantage of this.

## REST
One of the constraints of REST is, precisely, being cacheable. As it should be implemented as a layered system, an _application cache_ (in memory, Memcached or Redis) can be used in the REST server.

Given its architecture, resource-oriented, with a single identifier for each resource and promoting the visibility, it is also straight forward to get the caching support native to HTTP.

In HTTP, caches are controlled using the [`Cache-Control` header][HTTP Caching, in MDN], which accepts these directives:

* `no-store` - if a new request is done (because there is no valid pre-existing cached response), do not store the new response in the cache.
* `no-cache` - responses can be stored. New requests will be validate against the server before being returned.
* `private` - the response cannot be stored, unless by the client application.
* `public` - the response can be stored anywhere.
* `max-age` - sets the maximum amount of time in seconds, relative to the request time, to consider a resource fresh.

Example:

```
Cache-Control: public, max-age=604800
```

Note that a `Expires` header can be used to specify an absolute time to expire a cache. Although it will be ignored when `Cache-Control` is defined.

Cached resources are periodically removed or replaced (this process is known as _cache eviction_). Before its expiration time, a resouce is considered _fresh_. After its expiration time, it's called _stale_. In addition, if a response included either an [`ETag`][Etag (RFC 7232)] or an `Last-Modified` headers, then the cache would be able to be revalidated.

Most apps will limit their cache only to `GET` requests.

It's important to note that highly customizable RESTful APIs won't benefit as much from the HTTP cache. If clients are able to request embedded resources or sparse fieldsets the odds to reuse a stored fresh result are reduced.

## GraphQL
GraphQL servers expose a single entry point for the whole entity graph, so most of the time it cannot take advantage of the HTTP caching support.

* _Application cache_ can be used in the server side.
* When tunnelling GraphQL through `GET`, HTTP cache can be used as well. We need to prevent _mutations_ and _subscriptions_ from being cached, though. For example, making it mandatory to run them over `POST`.
* [Global object identification](https://graphql.org/learn/global-object-identification/) can be used to unequivocally identify an entity in GraphQL. This tool let client developers easily maintain their [local GraphQL cache](https://graphql.org/learn/caching/).

## gRPC
gRPC, like GraphQL, hijacks the HTTP protocol, so it cannot easily befeit from the native HTTP cache. However, default implementations of gRPC let API designers leverage [ETag-based HTTP caching][gRPC: ETag] through the definition of a string-typed field named `etag`, that will contain the [ETag][ETag (RFC 7232)] identifier in it.

In addition, gRPC can also use:

* _Application cache_ in the server side.
* _Local cache_ in the client side as long as we implement a robust identifiers model, as the Goblat Object Identification proposal of GraphQL.



## Resources
* [Caching Tutorial](https://www.mnot.net/cache_docs/)
* [HTTP Caching, in MDN][]
* [Prevent unnecessary network requests with the HTTP Cache][]
* [GraphQL & Caching: The Elephant in the Room][]
* [GraphQL: Caching][]

[HTTP Caching, in MDN]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching
[Prevent unnecessary network requests with the HTTP Cache]: https://web.dev/http-cache/
[GraphQL & Caching: The Elephant in the Room]: https://www.apollographql.com/blog/graphql-caching-the-elephant-in-the-room-11a3df0c23ad/
[GraphQL: Caching]: https://graphql.org/learn/caching/
[ETag (RFC 7232)]: https://tools.ietf.org/html/rfc7232#section-2.3
[gRPC: ETag]: https://cloud.google.com/apis/design/design_patterns#etags
