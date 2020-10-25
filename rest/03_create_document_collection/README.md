# Add a document to a collection
Sometimes, we want to add a new item to a collection of resources. For example, to create a new entry in a blog. To lessen confusion between post (as an article) and `POST` (as an HTTP method), let's call _news_ to the former. These are the recommended steps to add an item to a collection.

## HTTP method
Adding an item to a collection is a _unsafe_ and _non-idempotent_ operation. It's not _idempotent_ because the identifier for the new resource is chosen by the server, so runing the same operation twice will generate two resources. For this, we have the `POST` method.

## Identifier
Here we talk about the identifier of the resource we will be operate into. Typically, the collection itself is used for this, so that the combination `POST` plus _collection_ works as a factory method. For the sake of simplicity, let's consider `/news` is the URI of the collection.

## Request
The entity body of the HTTP request will contain the resource to be added. This resource (the news) might be represented in any way, for example in JSON. This Media Type should be specified in the entity header of the request. Some servers may consider the value of the optional header `Slug` ([`Slug` is defined in the Atom (RFC 5023)][Slug]) to generate the identifier (URI).

Example:

```
POST /news HTTP/1.1
Content-Type: application/json
Slug: first-post

{
    'title': 'This is my first post',
    'description': 'This is the beginning of a beautiful friendship'
}
```

## Response
The response, if successful, would be a `201 Created`. Typically, two things are included:

* A redirection to the new resource. This redirection is expressed through the `Location` header.
* A representation of the new resource. The _news_ will be added to the entity body; the `Content-Location` HEADER will identify the URI of the returned resource; and the `Content-Type` will specify the Media Type used for the resource.

Example:

```
HTTP/1.1 201 Created
Content-Type: application/json
Location: /news/first-post
Content-Location: /news/first-post

{
    'title': 'This is my first post',
    'description': 'This is the beginning of a beautiful friendship'
}
```

[Slug]: https://tools.ietf.org/html/rfc5023#section-9.7
