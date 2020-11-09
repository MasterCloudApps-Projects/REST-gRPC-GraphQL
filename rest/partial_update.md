# Partial update

Updates in REST are typically done using [`PUT`](../update_document/README.md). However, `PUT` completely updates a resource. When a client wants to update only part of a resource, [`PATCH`](https://tools.ietf.org/html/rfc5789) might be used instead. The representation of the _patch_ can be expressed in a variety of forms. Specifically, for JSON several specifications exists:

* [JSON Merge Patch (RFC 7396)](https://tools.ietf.org/html/rfc7396).
* [JSON Patch (RFC 6902)](https://tools.ietf.org/html/rfc6902).

## Request

### HTTP Method
`PATCH`, like `POST`, is an _unsafe_ an _non-idempotent_ operation.

### Entity Headers
Again, to prevent concurrent problems, it is advised to use _conditional requests_.

### Entity Body
The body will be expressed either in any standard specification, or in a custom schema. For example, if we are to use `JSON Patch`, we can express a set of changes like this:

```
[
    { op: "replace", path: "/price", value: 10},
    { op: "add", path: "/size", value: "XL" },
]
```

Which will update the value of the field `price` to `10`, and will add a field `size` with the value `XL`.

### Example
```
PATCH /products/10 HTTP/1.1
If-Unmodified-Since: Sun, 25 Oct 2020 18:31:40 GMT

{"op": "replace", "path": "/price", "value": 10}
```

## Response
The response will be that of a regular update call.

## Example
The example source code cointains a prepopulated collection of articles. Fetch any of them. Run:

```
curl -v http://localhost:4000/articles
```

Pick an `id` and then:

```
curl -v http://localhost:4000/articles/5fa96bb541a7ab6bb7f3bd65
```

To update it, you'll need to provide conditional headers and a patch, as in:

```
curl -v --header "Content-Type: application/json" \
--header "If-Unmodified-Since: Sun, 25 Oct 2020 18:31:40 GMT" \
--request PATCH \
--data '{"op": "replace", "path": "/title", "value": "This is title has been patched"}' \
http://localhost:4000/articles/5fa96bb541a7ab6bb7f3bd65
```

Now you can run `GET` again and only the price will have been updated.
