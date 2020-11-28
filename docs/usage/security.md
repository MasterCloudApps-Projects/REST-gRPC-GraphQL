# Security
An API needs to ensure several things, for example: only allowed users can access resources; the integrity and confidentiality of the information is ensured. Since both REST and GraphQL typically are used over the same transport protocol, same HTTP security practices usually apply.

## Integritiy and confidentiality of the data
We need to make sure that:

* **Integrity**: the representation of the data is consistent and accurante during its life cycle.
* **Confidentiality**: the information is protected from third-partys accesses.

HTTP is an non-secure protocol, which means the data on an HTTP request does not ensure neither integrity nor confidentiality. To overcome this, _Transport Layer Securty_, also known as [TLS (RFC 8446)][], is used:

> TLS allows client/server applications to communicate over the Internet in a way that is designed to prevent eavesdropping, tampering, and message forgery.

When using [HTTP over TLS (RFC 2818)][], we call it `HTTPS`. In this case, the URI (resource identifier), the headers and the body are encrypted. Note that some information is not encrypted, like the server name. There are some initiatives to also encrypt this: [TLS Encrypted Client Hello][].

## Authentication and authorization
First, lets recap what authentication and authorization are:

* **Authentication**: let a system know who you are.
* **Authorization**: tells what you can do.

This means you might be authentication in a system, but not authorized to access a certain resource.

Even though cookies can be used to provide authentication, and it's usage is not necessarely discouraged (as long as they are not used to provide _state_, and prevents CSRF attacks), they are not very commonly used in APIs. Instead, typically [HTTP Authorization][] is used for this.

[HTTP: Authentication (RFC 7235)][], by Roy Fielding (creator of REST), tells that:

>  The "Authorization" header field allows a user agent to authenticate itself with an origin server.

```
Authorization: <type> <credentials>
```

Where the `<type>` will specify which _scheme_ being used; the HTTP Authorization framework supports multiple schemes. There are several of them already [registered in the IANA][Authorization schemes in IANA].

When a request lacks of valid authentication credentials to access a protected resource, the server will return a `401 Unauthorized` response. It will also provide a `WWW-Authenticate` header field ([see section 4.1 of RFC 7235][HTTP: Authentication (RFC 7235)]) to indicate which _scheme_ should be used.

Also note that, in order to prevent cache servers from storing private and sensitive data, `Cache-Control: private` can be used.

We are using the `Authorization` header to both authenticate and check authorization. This is because of the stateless nature of request-response APIs.

Let's see the most commonly used mechanisms to provide authorization to an API:

* [`Basic` scheme](#basic-scheme).
* [`Digest` scheme](#digest-scheme).
* [`Bearer` scheme](#bearer-scheme).
* [API Keys](#api-keys).

### `Basic` scheme
[The 'Basic' HTTP Authentication Scheme (RFC 7617)] is the simplest mechanism, where the user identifier is sent together with its secret, all encoded in `base64`.

```
Authorization: Basic base64encode(<identifier>:<secret>)
```

Since base64 is a reversible encoding, this _scheme_ must be used only over TLS.

### `Digest` scheme
[HTTP Digest Access Authentication (RFC 7616)][] allows to send the credentials encrypted. It also contains a nonce-based mechanism to prevent _replay attacks_. When a client access a resource, the server will return a challenge in the `WWW-Authenticate` header:

```
WWW-Authenticate: Digest nonce="7ypf/xlj9XXwfDPEoM4URrv/xwf94BcCAzFZH4GiTo0v", qop="auth", algorithm="md5", realm="some realm"
```

* `nonce` - opaque string that will be used by clients to generate the digest.
* `qop` - or _quality of protection_, can be either `auth` (onlt the credentials are used to calculate the digest) or `auth-int` (both credentials and body are used to calculate the digest, thus providing integrity).
* `algorithm` - to specify the algorithm that must be used to calculate the digest. IANA maitains a list of [approved algorithms][Hypertext Transfer Protocol (HTTP) Digest Algorithm Values].

With those values, the client identifier, and the client secret, a `response` value will be calculated and sent in the `Authorization` header of the request (See section 3.4.1 Response of the [RFC 7616][HTTP Digest Access Authentication (RFC 7616)] for details).

### `Bearer` scheme
Originally created for OAuth 2.0, the [Bearer Token][The OAuth 2.0 Authorization Framework: Bearer Token Usage (RFC 6750)], also known as _Token Authorization_, is a scheme that specifies that:

> Any party in possession of a bearer token (a "bearer") can use it to get access to the associated resources

Typically, this token is issued as a result of an OAuth 2.0 handshake. However, it can also be used on its own (for example, with [API Keys](#api-keys)).

Similarly to [`Basic` scheme](#basic-scheme), `Bearer` must be used only over TLS (it's usage is mandatory).

#### OAuth 2.0
Described in [The OAuth 2.0 Authorization Framework (RFC 6749)][], this specification addresses several security issues, specially when delegating permissions to a third-party:

* Third-Parties no longer need to store resource owner's credentials.
* Servers no longer require password-based authentication.
* Third-Parties will have restricted (scoped) access to the owner's resources.
* Resource owners can revoke access to individual third-parties.

An access token can be get using:
* [Client credentials](https://www.oauth.com/oauth2-servers/access-tokens/client-credentials/) - Used when an application runs on its behalf to access its own resources (i.e. there is no user involved)
* [Authorization code](https://www.oauth.com/oauth2-servers/access-tokens/authorization-code-request/) - Used when a user is requested to gran permissions to the application. The user sends the application the _auth code_. Currently, it's the recommended mechanism for either server and client applications.
* [Refresh token](https://oauth.net/2/grant-types/refresh-token/) - When an access token has expired, a new one can be got using the _refresh token_.
* Legacy: [Password grant](https://www.oauth.com/oauth2-servers/access-tokens/password-grant/) - When a user shares its password with the application. Its usage is discouraged because it clearly goes against the spirit of OAuth.
* Legacy: [Implicit grant](https://oauth.net/2/grant-types/implicit/) - For standalone applications where an user authorizes in a consent screen and then they get back to the orignal page, but instead of bearing an auth code, an access token is immediately returned. This was proposed as a workaround, because browsers prevented javascript to access to domains different to the current one. CORS bypass this limitation.

#### JWT
Access tokens sent to an API using the `Bearer` scheme need to be opaque; they can just be a random string stored in the server which allows for identifying the user making the API call. [JWT (RFC 7519)][] can also be [used to encode an _Bearer Token_][JWT for Bearer Tokens]. They specify a uniform, self-contained token description that, since are self-contained and thus stateless, allow servers to escalate. Because of this, they industry is widely adopting this technology.

### API Keys
Like the [`Basic` scheme](#basic-scheme), API Keys are a very popular and simple mechanism to control the access to an API, present since the inception of HTTP APIs. Typically used when a _project_ needs access to an API (i.e. they don't need to access the API on behalf of a user), they are often used to prevent third-parties from abusing of a service (because they make too many requests or they violated the user agreement), and are sent in a number of places:

* As a query parameter: `GET /product?api_key=DkvTp96fGV2Bw7qc`. Note, this is completely discouraged. In browsers, they can be tracked in the history. In webservers, they might be stored in access logs.
* As an `X-API-Key` header: `X-API-Key: DkvTp96fGV2Bw7qc`.
* In a cookie: `Cookie: X-API-Key=DkvTp96fGV2Bw7qc`.
* In a `Bearer` scheme: `Authorization: Bearer DkvTp96fGV2Bw7qc`.
* In a `Basic` scheme: `Authorization: Basic RGt2VHA5NmZHVjJCdzdxYzo=`, using either the `<user>` or the `<secret>` and leaving the other empty.

## CORS
[CORS][] (Cross-Origin Resource Sharing) is a specification that let servers tell browsers whether they accept requests from third-party sites. If our API is intended only to be used from our site, we can use CORS to prevent other websites to access our REST API.

When browser in a site, `foo.com`, wants to access a resource on another site, `bar.com`, from the javascript code, it will add an `Origin` header to the request, for example `Origin: https://foo.com/`. The server will respond with a `Access-Control-Allow-Origin` header, using as a value `*` to tell _the resource can by accessed by any origin_. If the resource can only be accessed by `bar.com`, it might respond with `Access-Control-Allow-Origin: https://bar.com`. For _preflighted requests_ (these are requests that do not meet a list of basic requirements), an pre-request of type `OPTIONS` is made to the server, to verify if the request can be done. The server might respond with:

* `Access-Control-Allow-Methods` listing the allowed methods, 
* `Access-Control-Allow-Headers` listing the allowed headers,
* `Access-Control-Allow-Credentials` telling whether it accept or not user-provided credentials.

This _preflight request_ is done automatically by the browser when using `XMLHttpRequest` or the `Fetch API` and the request is not _simple_ (for example, when using `application/json` as the `Content-Type`, or when sending a credential through cookies or the `Authorization` header).

## gRPC Authentication
Nativelly, gRPC nativelly supports three authentication methods:

* **TLS** - TLS certificates can be used to provide authentication, integrity and confidetiality.
* **ALTS** - Similar to TLS, [ALTS](https://cloud.google.com/security/encryption-in-transit/application-layer-transport-security) is a Protocol Buffer based authentication mechanism conceived for the Google Cloud Platform.
* **Token-based for Google** - When connection to Google Services, this third mechanism can be used.

Since gRPC hijacks the HTTP communication protocol, it's not that easy to take advantage of the native HTTP authentication mechanisms. Most solutions leverage the use of middlewares to add a custom authentication layer on top of gRPC ([Example in nodejs](https://medium.com/compli-engineering/grpc-nodejs-using-jwt-authentication-b048fef6ecb2), [Example in Go](https://medium.com/@tillknuesting/grpc-http-basic-auth-oauth2-bearer-tokens-f088b5a2314)).

## Source code
Our sample application contains some API calls protected. Let's see how we can access them:

### REST
The provided example code shows how we can use `Bearer` scheme using `JWT`. To log in, a POST request to `/login` will be done sending a JSON payload with the `username` and the `password`:

```
curl -v -H "Content-Type: application/json" \
    -X POST -d '{"username": "pepe", "password":"secret"}' \
    http://localhost:4000/login
```

If the request is successful, a JSON object with a `JWT` in it will be generated:

```json
{
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InBlcGUiLCJpYXQiOjE2MDUzNzQzNzJ9.luGIDxqgRBr-na8bFlxWO_iq_lUQcHzXZ5RjKwXw6Ig"
}
```

Now, to get access to a private resource we can run:

```
curl -H "Content-Type: application/json" \
    -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InBlcGUiLCJpYXQiOjE2MDUzNzQzNzJ9.luGIDxqgRBr-na8bFlxWO_iq_lUQcHzXZ5RjKwXw6Ig" \
    http://localhost:4000/clients/06580190M
```

Which will return:

```json
{
    "dni": "06580190M",
    "IBAN": "ES4404877434913522416372"}
}
```

Also note that CORS is enabled for the whole REST API. For example, if we request `curl -v http://localhost:4000/distances/Madrid/Barcelona`, we will get a response header `Access-Control-Allow-Origin: http://localhost:4000/`, thus preventing browsers from using this requests in unauthorized pages.

### GraphQL
Let's try to access a `client`, which is restricted resource, without any authorization mechanism:

```
curl -X POST -H "Content-Type: application/json" \
    -d '{"query": "{client(dni:\"06580190M\") {iban} }"}' \
    http://localhost:4000/graphql
```

We will get this error message: `Access restricted. Please, provide a valid access token`. To get an `accessToken`, we need to login:

```
curl -v -H "Content-Type: application/json" \
    -X POST -d '{"username": "pepe", "password":"secret"}'
    http://localhost:4000/login
```

Once we have the `accessToken`, we will set it in the `Authorization` header using the `Bearer` scheme:

```
curl -X POST -H "Content-Type: application/json" \
    -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InBlcGUiLCJpYXQiOjE2MDUzNzkyMzh9.qo2ovz3Zm99OQH_rcAqEsPiYfKBlfKpmnDlXHjBNzkk" \
    -d '{"query": "{client(dni:\"06580190M\") {iban} }"}' \
    http://localhost:4000/graphql
```

Now, the client private data has been returned:

```json
{
    "dni": "06580190M",
    "IBAN": "ES4404877434913522416372"}
}
```

In addition, CORS is also enabled. For example, if we run this query:

```
curl -X POST -v -H "Content-Type: application/json" \
    -d '{"query": "{articles {totalCount}}"}' \
    http://localhost:4000/graphql
```

We will get a `Access-Control-Allow-Origin: http://localhost:4000/` response header.

## Resources
* 🔗 [REST Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html), in OWASP.
* 🔗 [RESTful API Authentication Basics](https://blog.restcase.com/restful-api-authentication-basics/).
* 🔗 [TLS (RFC 8446)][]
* 🔗 [HTTP over TLS (RFC 2818)][]
* 🔗 [TLS Encrypted Client Hello][] - still a draft (Dec 2020)
* 🔗 [HTTP: Authentication (RFC 7235)][]
* 🔗 [The 'Basic' HTTP Authentication Scheme (RFC 7617)][]
* 🔗 [HTTP Digest Access Authentication (RFC 7616)][]
* 🔗 [The OAuth 2.0 Authorization Framework: Bearer Token Usage (RFC 6750)][]
* 🔗 [The OAuth 2.0 Authorization Framework (RFC 6749)][]
* 🔗 [JWT (RFC 7519)][]
* 🔗 [The Web Origin Concept (RFC 6454)][]
* 🔗 [HTTP Authorization][] in the MDN
* 🔗 [CORS][] in the MDN
* 🔗 [JWT for Bearer Tokens][]
* 🔗 [Authorization schemes in IANA][]
* 🔗 [Hypertext Transfer Protocol (HTTP) Digest Algorithm Values][] in IANA
* 📖 [RESTFul Web Services Cookbook, Chapter 12](https://www.oreilly.com/library/view/restful-web-services/9780596809140/)

[TLS (RFC 8446)]: https://tools.ietf.org/html/rfc8446
[HTTP over TLS (RFC 2818)]: https://tools.ietf.org/html/rfc2818
[TLS Encrypted Client Hello]: https://datatracker.ietf.org/doc/draft-ietf-tls-esni/?include_text=1
[HTTP Authorization]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication
[HTTP: Authentication (RFC 7235)]: https://tools.ietf.org/html/rfc7235
[Authorization schemes in IANA]: https://www.iana.org/assignments/http-authschemes/http-authschemes.xhtml
[The 'Basic' HTTP Authentication Scheme (RFC 7617)]: https://tools.ietf.org/html/rfc7617
[Hypertext Transfer Protocol (HTTP) Digest Algorithm Values]: https://www.iana.org/assignments/http-dig-alg/http-dig-alg.xhtml
[HTTP Digest Access Authentication (RFC 7616)]: https://tools.ietf.org/html/rfc7616
[The OAuth 2.0 Authorization Framework: Bearer Token Usage (RFC 6750)]: https://tools.ietf.org/html/rfc6750
[The OAuth 2.0 Authorization Framework (RFC 6749)]: https://tools.ietf.org/html/rfc6749#section-1
[JWT (RFC 7519)]: https://tools.ietf.org/html/rfc7519
[The Web Origin Concept (RFC 6454)]: https://tools.ietf.org/html/rfc6454
[JWT for Bearer Tokens]: https://oauth.net/2/jwt/
[CORS]: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
