# Add a document to a store
_Stores_ are repositories of _documents_. But unlike _collections_, this process is client-driven (the identifier is provided by the client). We can use a resource of type _store_ to upload file resources, for example.

## Request

### HTTP method
Adding a resource to a store is _unsafe_ and _idempotent_, so `PUT` will be used.

### Identifier
Will be the identifier the client want to use for the new/updated resource, for example `/products/computer`.

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
