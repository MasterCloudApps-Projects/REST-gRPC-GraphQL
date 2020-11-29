# Custom methods

Every API style sets some boundaries in how we design our interface. For example, in GraphQL we need to express every operation in terms of _queries_ and _mutations_, whereas in REST they will be mapped to any verb of the underlying transport protocol. Some operations are straightforward, for example a _read_, while others might be tricky. Let's see how to go about them.

## Pure functions
We call a pure function an operation that has no side effects. Many API calls can be thought as pure functions. For example, a method which transforms from Fahrenheit to Celsius, or an action which calculates the distance between two cities.

### REST
We can use `GET` to express a _verb_ of a _safe_ and _idempotent_ operation. For example, let's consider the distance between cities example; in this case, the resource would be the _input_ of the URI, and the representation would be the distance returned, as in:

```/distance/Madrid/Seville```

> Note this might not be _pure_ REST, as this URI wouldn't be opaque.

### GraphQL
In HTTP, a `GET` request is expected to be _safe_ (i.e. with no side-effects). One might think GraphQL _queries_ must not have side-effects either. Although it is not mandatory, _queries_ usually are _safe_. To express an operation that does not have side-effects, we can use a query. An example of this is _calculate the distance between two cities_:

```graphql
type Query {
    distance(from: String!, to: String!): Distance!
}
```

## State transitions
Resources have both _state_ and _state transitions_. For example, an _order_ might be _pending_, _paid_, _shipped_ or _delivered_. We can think of a resource as a _state machine_ with allowed transitions.

### REST
For simple cases, we can map a state to a field: a field called `status` for a music player, which accepts a number of possible options, or a field called `activated` of type boolean.

On a truly _RESTFul Web Service_ that follows the HATEOAS constraint, a _custom action_ can be expressed just as a possible state transition to a resource.

### GraphQL
A _mutation_ will be used to express a change state. This can be done either in a _resource-oriented_ or in a _action-oriented_ approach. If our API is _resource-oriented_, we can define a custom field which contains the state, as in a field called `status`. To update it, a generic update mutation can be used, or a specific mutation:

```graphql
type Mutation {
    updateOrder(order: Order!): Order!
    updateOrderStatus(orderId: ID!, status: Status!): Order!
}
```

If the API follows an _action-oriented_ style, then it might expose specific methods. For example, to turn a microwave on:

```graphql
type Mutation {
    turnMicrowaveOn(microwaveId: ID!): Microwave!
}
```

There is no such think as HATEOAS for GraphQL. This means client applications will need more knowlodege, but also they will do a better use of the network traffic.

## Other unsafe operations
Even though almost any operation can be expressed in terms of just state transitions, sometimes this approach does not naturally fit our action. There are several ways to workaround this for each API style.

### REST
#### Embedded resources
In REST we can also create new resources. These resources will map actions into them. For example, we can use this technique to send a recovery password email to a user. The new embedded resource will belong to `user` and might cointain the `sent_date` and the `hash_code` used in the recovery URL.

Looking at real world REST APIs, we find that GitHub defined an [embedded resource in gists][GitHub embedded resources to star gists] (a form of shareable snippets of code) to _star_ or _unstar_ them, as in `PUT|DELETE /gists/:gist_id/start`.

[Paypal as well allows to authorize a payment][Paypal embedded resources to authorize payments] creating a resource of type `authorize` into an order: `PUT /v2/checkout/orders/5O190127TN364715T/authorize`.

#### Controller resources
Another option available to REST APIs is creating a resource of type _controller_. This can be used for a number of cases:

* To merge two resources.
* To create a copy of a resource.
* To move a resource.
* To run bulk operations.

Chapter 11 of [RESTful Web Services Cookbook] gives lot of details on how these controllers can be articulated. [Google Cloud API Design guide][] also provides good examples on when and how to create custom methods.

### GraphQL
As its name suggest, _mutations_ will be used to express any other operation that _changes_ the state of a resource. But, unlike other styles, GraphQL does not impose any restriction on how to address this operation: it can be _resource-oriented_ or it can be _action-oriented_. For example, we can define a _mutation_ to merge two users:

```graphql
type Mutation {
    mergeUsers(from:ID!,to:ID!): User!
}
```

## Source code
The demo project contains a naive example of how to implement a custom operation. Specifically, using a pure function to calculate the distance between to cities.

### REST
To get the distance between Madrid an Barcelona in REST, we can just:

```
curl -v http://localhost:4000/distances/madrid/barcelona
```

It will return a distance expressed in `text/plain`.

### GraphQL
To get the distance between `Madrid` and `Barcelona`, run this query:

```
{
  distance(from:"Madrid",to:"Barcelona") {
    from
    to
    km
  }
}
```

## Resources
* [Representing state in REST and GraphQL](https://apisyouwonthate.com/blog/representing-state-in-rest-and-graphql)

[GitHub embedded resources to star gists]: https://developer.github.com/v3/gists/#star-a-gist
[Paypal embedded resources to authorize payments]: https://developer.paypal.com/docs/api/orders/v2/#orders_authorize
[RESTful Web Services Cookbook]: https://learning.oreilly.com/library/view/restful-web-services/9780596809140/
[Google Cloud API Design guide]: https://cloud.google.com/apis/design/custom_methods
