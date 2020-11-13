# Partial update
A partial update allows a client application to submit only those changes it is interesting in, thus reducing the traffic and hence the performance.

## Operation
Side-effects in GraphQL are done using _mutations_. Unlike HTTP, in GraphQL there is no specific routine or verb to run a partial update. A bespoke _mutation_ can be used for this.

A [popular approach][GraphQL mutations: Partial updates implementation] for partial updates is creating a _mutation_ whose parameters are optional, so that only those that resolve to a _defined_ value, will be updated:

```graphql
    type Mutation {
        patchProduct(id: ID!, name:String!, price:Int!): Product
    }
```

Which allows client side to run something like this:

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

Whatever of these approaches we use, they are not as powerful as [JSON-PATCH](https://tools.ietf.org/html/rfc6902): we cannot run more complex operations, like adding or removing an entry to an array. Of course, a JSON-PATCH object can be embedded into a string in a mutation, but this goes against the static-typing nature of GraphQL, although there are [some attempts to get a similar experience][GraphQL Mutation Design: Batch Updates].

[GraphQL mutations: Partial updates implementation]: https://medium.com/workflowgen/graphql-mutations-partial-updates-implementation-bff586bda989
[GraphQL Mutation Design: Batch Updates]: https://medium.com/@__xuorig__/graphql-mutation-design-batch-updates-ca2452f92833
