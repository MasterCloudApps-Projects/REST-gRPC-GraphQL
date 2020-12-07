# Error handling
Sometimes, in the context of a request, an error might pop up, either from the client side (_malformed request_, _the resource does not exist_, _user is unauthorized_, etc) or in the server side (_the disk run out of space_, _an unhandled error was thrown_, etc). Every API needs to provide a mechanism to report errors as a response to client applications.

## REST
_RESTful Web Services_ should use the HTTP protocol to express errors to the client application. In addition, errors can be detailed in the payload as well.

Meaningful `response status codes` should be used. A complete list of response status codes can be found in the [Section 6 of the RFC 7231][].

For example, when requesting a nonexisting resource, return a `404`. However, sometimes this can be confusing:

* Consider this identifier: `/departments/:deptID/employees?id=Smith`. If for the given department there is no employee whose identifier is `smith`, a `404` looks fine. What if there is no department for `:deptID`? What should we return?
* If we get a `404`, can we assume a resource does not exist? Can we safely delete our local copy? What if we are getting that just because of a misconfiguration on NGINX? HTTP server errors might be conflated with application logic errors.

HTTP responses are limited, as we have just seen. Sometimes, we need room to add more details. We can express error descriptions in the body. For this, several solutions have been proposed: [JSend][], [Problem Details For HTTP APIs (RFC 7807)][]. For example, in the RFC 7807 we can express an _out of credit_ error like this:

```json
{
    "type": "https://example.com/probs/out-of-credit",
    "title": "You do not have enough credit.",
    "detail": "Your current balance is 30, but that costs 50.",
    "instance": "/account/12345/msgs/abc",
    "balance": 30,
    "accounts": ["/account/12345", "/account/67890"]
}
```

## GraphQL
In GraphQL, an application should lead with several error mechanisms:

* **HTTP errors**: On the one hand, it needs to manage HTTP errors as in any other Web API. This can be for example when there is a network problem and the server is not reachable.
* **GraphQL server errors**: On the other, the GraphQL server should be able to report errors to the client. If the user provides an invalid input, this will be reported as a GraphQL error.

The HTTP errors can be handled as usual in a REST application, both from the server and the client perspective.

GraphQL errors typically are expressed in the JSON response:

```json
{
    "data": {},
    "errors": []
}
```

Most implementations will fill the `errors` array automatically, providing client app with many debugging information. For example, if we ask for an invalid field in Apollo Server, we will get something like this:

```json
{
    "errors": [
        {
            "message": "Cannot query field \"foo\" on type \"Bar\".",
            "locations": [
                {
                    "line": 3,
                    "column": 5
                }
            ],
            "extensions": {
                "code": "INTERNAL_SERVER_ERROR"
            }
        }
    ]
}
```

[Apollo Server][] is bundled with a number of common errors, ready to be used, that will provide a readable error code in their `extensions.code` field. This can be done [without using any specific framework logic][Custom errors and error reporting in GraphQL] as well.

In addition, most GraphQL server implementations provide a mechanism to let API designers to format a custom error message, as in the [`CustomFormatErrorFn` option of the `express-graphql` project][express-graphql].

Also note that the `errors` field is an array, so several errors can be reported to a single API call. This comes handy when [validating every field from a form][Validation and user errors in GraphQL mutations].

### Example
When we try to remove an non-existing issue in GitHub:

```graphql
mutation {
    deleteIssue(input: {issueId:5}) {
        repository {
            name
        }
    }
}

```

this is what we get:

```json
{
    "data": {
        "deleteIssue": null
    },
    "errors": [
        {
            "type": "NOT_FOUND",
            "path": [
                "deleteIssue"
            ],
            "locations": [
                {
                    "line": 2,
                    "column": 3
                }
            ],
            "message": "Could not resolve to a node with the global id of '5'"
        }
    ]
}
```

## gRPC
When a call runs successfully, it will return an `OK` status code to the client application. When it fails, though, gRPC defines a list of [error status codes](https://grpc.io/docs/guides/error/#error-status-codes) that will be sent back to the client. This error model is independent of the data format used (i.e. it's independent of Protocol Buffers). For example:

* `GRPC_STATUS_CANCELLED` - The client application cancelled the request.
* `GRPC_STATUS_DEADLINE_EXCEEDED` - Exceeded the deadline/timeout specified by the client.
* `GRPC_STATUS_UNIMPLEMENTED` - Method undefined in the server.
* `GRPC_STATUS_INTERNAL` - Covers several errors, like parsing errors in either the request or the response or compression algorithms errors.
* `GRPC_STATUS_UNKNOWN` - The server threw an unhandled exception.

### Google Error model
The above error model, standard to gRPC, it's very limited and lacks of enough error detail. gRPC recommends that API designers follow the [Google API Error Model][]. It's the protocol-agnostic mechanism to express errors used by Google, both in HTTP and gRPC APIs.

When a client makes a request, the response will contain a _union field_ of either:
* type `status`, when the request failed.
* or type `response`, with the request response, when it was run successfully.

Then, the field of type `status` will contain a number of details of the error/s:

```proto
message Status {
  // A simple error code that can be easily handled by the client. The
  // actual error code is defined by `google.rpc.Code`.
  int32 code = 1;

  // A developer-facing human-readable error message in English. It should
  // both explain the error and offer an actionable resolution to it.
  string message = 2;

  // Additional error information that the client code can use to handle
  // the error, such as retry delay or a help link.
  repeated google.protobuf.Any details = 3;
}
```

## Resources
* [Google API Error Model][]
* [Guide to gRPC Errors](http://avi.im/grpc-errors/)

## Source code

[Section 6 of the RFC 7231]: https://tools.ietf.org/html/rfc7231#section-6
[JSend]: https://github.com/omniti-labs/jsend
[Problem Details For HTTP APIs (RFC 7807)]: https://tools.ietf.org/html/rfc7807
[Apollo Server]: https://www.apollographql.com/docs/apollo-server/data/errors/
[Custom errors and error reporting in GraphQL]: https://codeburst.io/custom-errors-and-error-reporting-in-graphql-bbd398272aeb
[express-graphql]: https://www.npmjs.com/package/express-graphql
[Validation and user errors in GraphQL mutations]: https://medium.com/@koistya/validation-and-user-errors-in-graphql-mutations-39ca79cd00bf
[Google API Error Model]: https://cloud.google.com/apis/design/errors
