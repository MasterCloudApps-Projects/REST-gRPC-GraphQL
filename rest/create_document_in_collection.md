# Add a document to a collection
Sometimes, we want to add a new item to a collection of resources. For example, to create a new entry in a blog. To lessen confusion between post (as an article) and `POST` (as an HTTP method), let's call _news_ to the former. These are the recommended steps to add an item to a collection.

## Request
Adding an item to a collection is a _unsafe_ and _non-idempotent_ operation. It's not _idempotent_ because the identifier for the new resource is chosen by the server, so runing the same operation twice will generate two resources. For this, we have the `POST` method.

Typically, to create a document resource in a collection, the resource we operate into is the collection itself, so that the combination `POST` plus _collection_ works as a factory method. For the sake of simplicity, let's consider `/news` is the URI of the collection.

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

## Stores
_Stores_ are repositories of _documents_. But unlike _collections_, this process is client-driven (the identifier is provided by the client). We can use a resource of type _store_ to upload file resources, for example.

### Requests
Adding a resource to a store is _unsafe_ and _idempotent_, so `PUT` will be used instead of `POST`.

### Identifier
Will be the identifier the client want to use for the new or updated resource, for example `/products/computer`.

### Headers and body
The rest of the request will behave as a regular `POST` request to add a resource in a collection.

Example:

```
PUT /products/computer HTTP/1.1
Content-Type: application/json

{
    'name': 'Personal Computer',
    'price': 500
}
```

## Example
To create a new entry in our example application, we will use a _collection_. Run:

```
curl -v -H "Content-Type: application/json" \
    -d '{ "title": "This is my first post", "description": "This is the beginning of a beautiful friendship"}' \
    http://localhost:4000/articles
```

The above request will return a Location header. To fetch the entry created above, run (updating the identifier):

```
curl -v --request GET http://localhost:4000/articles/5fa5694ce5f5657b361d7cfe
```

[Slug]: https://tools.ietf.org/html/rfc5023#section-9.7
