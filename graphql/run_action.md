# Run action
Given the nature of GraphQL, where _queries_ and _mutators_ can be defined at will, there is no limitation on how to _express_ any action. As it happens with a regular RPC protocol, it is straightforward to express any action in GraphQL.

## Pure functions
In HTTP, and thus in REST, a `GET` request is expected to be _safe_ (i.e. with no side-effects). One might think GraphQL _queries_ must not have side-effects either. Although it is not mandatory, _queries_ usually are _safe_. To express an operation with no side-effects, we can use a query. To get the distance between two cities, we can define it as follows:

```
type Query {
    distance(from: String!, to: String!): Distance!
}
```

## Unsafe operations
As its name suggest, _mutators_ will be used to express an operation which _changes_ the state of a resource. But, unlike REST, GraphQL does not impose any restriction on how to address the operation: it can be resource-oriented (as REST), or it can be procedure-oriented (as a regular RPC or a REST-Like _controller_ ).

## Example
To get the distance between `Madrid` and `Barcelona`, run this query in the provided code:

```
{
  distance(from:"Madrid",to:"Barcelona") {
    from
    to
    km
  }
}
```
