# Update en un store
Sometimes, we need to update an existing resource. This resource might be a single document or might be a document in a repository. For example, to update the price of a product.

## Request

### HTTP Method
This is an _unsafe_ and _idempotent_ operation. `PUT` suits well here.

### Identifier
The identifier will be that of the resource we want to update, for example, `/products/12`.

### Entity body
Will be the new representation. This will override the previous one.

### Headers
The server might enforce _conditional requests_ to prevent race conditions while update the resource. For this, the client must provide one or more conditional headers when updating, like `If-Unmodified-Since` or `If-Match` (they can be empty on creation).

### Example
Example:

```
PUT /products/12 HTTP/1.1
Content-Type: application/json
If-Match: W/"2f-1enSYy6fyIcEanN2CM5rqcZISwc"

{
    'name': 'Personal Computer',
    'price': 550
}
```

## Response
The server might observe _conditional requests_, If so:
1. If no conditional headers have been provided:
    1. If the resource exist: `403 Forbidden`
    2. If the resource does not exist: `201 Created`
2. If conditional headers are provided:
    1. If preconditions match: `200 Ok`
    2. If preconditions do not match: `412 Precondition Failed`
