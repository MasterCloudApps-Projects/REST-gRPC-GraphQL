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

### More verbs
We can use `GET` to express a _verb_ of a _safe_ and _idempotent_ operation. For example, let's think of an API which returns the distance between two cities. In this case, the resource would be the _input_ of the URI, and the representation would be the distance returned. For example:

```/distance/Madrid/Seville```

## Representation
A resource might be represented in a number of ways. For now, let's assume we only support the `text/plain` Media Type.
