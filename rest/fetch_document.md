# Fetch a document

To fetch a single document resource in a RESTful Web Service, we need to consider several things:

* Which HTTP method is the more apropriate.
* How we identify the resource.
* How we represent the resource.

## HTTP method
A fetching does not have side effects, so it is both a safe and an idempotent operation. Besides, the underneath semantic matches that of `GET`. So for this we will use `GET`.

## Identifier
REST identifiers are _opaque_, so technically this is a perfectly valid identifier for a document of a product:

```/33b27e35-8f1a-4e05-8c4a-e36a90cffd9b```

However, if we want to stick to the most commonly used name standard, we will something like this instead:

```/products/12```

## Representation of a resource
With REST, a client can use HTTP to negotiate how the want to receive the representation of the state of a resource, as long as the server supports several Media Types.

Most of the time, the resources will be represented using a meta-language, using either XML, JSON or YAML. Some people argue that this feature of REST is not that useful, since most modern programming languages can easily handle all those formats.

### `Accept` HTTP header
To negotiate the representation of a resource, the client may suggest its preference to the server using the `Accept` header, as in `Accept: application/json, text/plain, */*;q=0.8`.


## Example
To fetch a document run any of the following, you first need its id. Run:

```
curl http://localhost:4000/articles
```

Select any of the articles ids and then:

```
curl -v http://localhost:4000/articles/5fa95ab13e06593195951418
```

The above request will return the selected article in the default Media Type (`application/json`):

```
{
    "title": "Title 2",
    "description": "Description 2"
}
```

In order to fetch in other Media Type (for example, `text/plain`):

```
curl -v --header "Accept: text/plain" http://localhost:4000/products/12
```

Which might return something like:

```
This is the text/plain representation of the article #5fa95ab13e06593195951418
```
