# Delete a resource
To delete a resource (regardless of its type), we can just carry out a `DELETE` HTTP call to the resource.

## Request

### HTTP Method
`DELETE` will be used. Note this is an _unsafe_ and _idempotent_ operation.

### Example
```
DELETE /products/1 HTTP/1.1
```

## Response
Typically, a `204 No Content` will be returned. Since the `DELETE` method is idempotent, when run twice or more times, same result should be returned. This is controversial: how can we distinguish an already removed resource from a resource that never existed in the first place? Should we keep a local list of already-removed identifiers? Is this safe enough?
