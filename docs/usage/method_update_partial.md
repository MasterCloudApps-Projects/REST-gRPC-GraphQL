#  Standard method: update (partial)
Sometimes, we want to be able to update a resource partially: for example, to update the state of an element, or to atomically increment a value. In these cases, a full replacement might not be convenient. This allows a client application to submit only those changes it is interesting in, thus improving client-side code maintainability, and reducing the traffic and hence improving the network performance.

## REST
Updates in REST are typically done using [`PUT`](method_update.md). However, `PUT` completely updates a resource. When a client wants to update only part of a resource, [`PATCH` (RFC 5789)][PATCH Method for HTTP] might be used instead. The representation of the _patch_ can be expressed in a variety of forms. Specifically, for JSON several specifications exists:

* [JSON Merge Patch (RFC 7396)][].
* [JSON Patch (RFC 6902)][]

`PATCH`, like `POST`, is an _unsafe_ an _non-idempotent_ operation. Again, to prevent concurrent problems, it is advised to use _conditional requests_.

The body will be expressed either in any standard specification, or in a custom schema. For example, if we are to use `JSON Patch`, we can express a set of changes like this:

```
PATCH /products/10 HTTP/1.1
If-Unmodified-Since: Sun, 25 Oct 2020 18:31:40 GMT

[
    { "op": "replace", "path": "/price", "value": 10},
    { "op": "add", "path": "/size", "value": "XL" },
]
```

Which will update the value of the field `price` to `10`, and will add a field `size` with the value `XL`.

The response will be that of a regular update call.

## GraphQL
Side-effects in GraphQL are done using _mutations_. Unlike HTTP, in GraphQL there is no specific routine or verb to run a partial update. A bespoke _mutation_ can be used for this.

A [popular approach][GraphQL mutations: Partial updates implementation] for partial updates is creating a _mutation_ whose parameters are optional, so that only those that resolve to a _defined_ value will be updated:

```graphql
    type Mutation {
        patchProduct(id: ID!, name:String!, price:Int!): Product
    }
```

Which allows client-side to run something like this:

```graphql
mutation patchProduct($id:ID, $name:String!, $price:Int!) {
    patchProduct(id:$id, name:$name, price:$price) {
        id
        name
        price
    }
}
```

Variables:

```json
{
    "id": 5,
    "name": "Smartphone"
}
```

In which case only the `name` would have been updated.

This technique also allows to unset a field. For example, to _unset_ the `price`, these variables can be used:

```json
{
    "id": 5,
    "price": null
}
```

A custom _input_ type could have been used as well: a `PatchProductInput` that accepts empty values.

Whatever of these approaches we use, they are not as powerful as [JSON-PATCH][JSON Patch (RFC 6902)]: we cannot run more complex operations, like adding or removing an entry to an array. Of course, a JSON-PATCH object can be embedded into a string in a mutation, but this goes against the static-typing nature of GraphQL, although there are [some attempts to get a similar experience][GraphQL Mutation Design: Batch Updates].

## gRPC
Partial updates are the recommended way to run an update operation in gRPC. They are carried out using a [`FieldMask`](https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#fieldmask), as in a [Get method](method_get.md). In this case, in addition to the resource, the response will also contain a `FieldMask` field specifying which fields will be updated.

```proto
rpc UpdateArticle(UpdateArticleRequest) returns (Article);

message UpdateArticleRequest {
  Article article = 1;
  FieldMask update_mask = 2;
}
```

## Source code

### REST
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

## Resources
* [PATCH Method for HTTP (RFC 5789)][]
* [JSON Merge Patch (RFC 7396)][]
* [JSON Patch (RFC 6902)][]
* [GraphQL mutations: Partial updates implementation][]
* [GraphQL Mutation Design: Batch Updates][]

[PATCH Method for HTTP (RFC 5789)]: https://tools.ietf.org/html/rfc5789
[JSON Merge Patch (RFC 7396)]: https://tools.ietf.org/html/rfc7396
[JSON Patch (RFC 6902)]: https://tools.ietf.org/html/rfc6902
[GraphQL mutations: Partial updates implementation]: https://medium.com/workflowgen/graphql-mutations-partial-updates-implementation-bff586bda989
[GraphQL Mutation Design: Batch Updates]: https://medium.com/@__xuorig__/graphql-mutation-design-batch-updates-ca2452f92833
