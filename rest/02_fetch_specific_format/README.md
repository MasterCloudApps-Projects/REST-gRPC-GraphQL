# Representation of a resource
With REST, a client can use HTTP to negotiate how the want to receive the representation of the state of a resource, as long as the server supports several Media Types.

Most of the time, the resources will be represented using a meta-language, using either XML, JSON or YAML. Some people argue that this feature of REST is not that useful, since most modern programming languages can easily handle all those formats.

## HTTP method
Again, we will use `GET`.

## Request
Now, instead of letting the server choose any representation, the client will suggest its preference using the `Accept` header, as in `Accept: application/json, text/plain, */*;q=0.8`.
