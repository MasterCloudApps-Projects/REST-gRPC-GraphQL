# Delete a resource
To delete a resource (regardless of its type), we can just carry out a `DELETE` HTTP call to the resource.

## Request

### HTTP Method
`DELETE` will be used. Note this is an _unsafe_ and _idempotent_ operation.

```
DELETE /products/1 HTTP/1.1
```

## Response
Typically, a `204 No Content` will be returned. Since the `DELETE` method is idempotent, when run twice or more times, same result should be returned. This is controversial: how can we distinguish an already removed resource from a resource that never existed in the first place? Should we keep a local list of already-removed identifiers? Is this safe enough?

## Example
To create a new entry, run:

```
curl -v -H "Content-Type: application/json" \
    -d '{ "title": "This is my first post", "description": "This is the beginning of a beautiful friendship"}' \
    http://localhost:4000/articles

```

The above request will return a Location header. To fetch the entry created above, run (updating the identifier):

```
curl -v http://localhost:4000/articles/5fa5694ce5f5657b361d7cfe
```

```
curl -v -X DELETE http://localhost:4000/articles/5fa5694ce5f5657b361d7cfe
```
