# Run action
As we've seen, one key feature of HTTP in general, and in REST in particular, is that their systems are data-oriented: unlike RPC, in REST any behaviour should be expressed in terms of resource transitions.

To run an operation that does not clearly match any of the verbs provided by HTTP, we have several choices:

## Custom field
We can map a state to a field. For example, a field called `status` for a music player which accepts a number of possible options, or a field called `activated` of type boolean.

## Embedded resources
We can also create a new resource. This resource will map an action into it. For example, we can use this to send a recovery password email to a user. The new embedded resource will belong to `user` and might cointain the `sent_date` and the `hash_code` used in the recovery URL.

Lookin at real world REST APIs, we find that GitHub defined an [embedded resource in gists][GitHub embedded resources to star gists] (a form of shareable snippets of code) to _star_ or _unstar_ them, as in `PUT|DELETE /gists/:gist_id/start`.

[Paypal as well allows to authorize a payment][Paypal embedded resources to authorize payments] creating a resource of type `authorize` into an order: `PUT /v2/checkout/orders/5O190127TN364715T/authorize`.

## Controller resources
Create a resource of type _controller_. For example:

* To merge two resources.
* To create a copy of a resource.
* To move a resource.
* To run bulk operations.

Chapter 11 of [RESTful Web Services Cookbook] gives lot of details on how these controllers can be articulated. [Google Cloud API Design guide][] also provides good examples on when and how to create custom methods.

[GitHub embedded resources to star gists]: https://developer.github.com/v3/gists/#star-a-gist
[Paypal embedded resources to authorize payments]: https://developer.paypal.com/docs/api/orders/v2/#orders_authorize
[RESTful Web Services Cookbook]: https://learning.oreilly.com/library/view/restful-web-services/9780596809140/
[Google Cloud API Design guide]: https://cloud.google.com/apis/design/custom_methods
