# Add a document to a collection (Async)
We've covered how we can add a document to a [collection](../create_document_collection/README.md) or to a [store](../put_document_store/README.md). Sometimes, things get more complicated, and the resource creation on the server end takes too long to give a synchronous answer. In this cases, we can create a new resource of type `task`, which will contain a `status` to let us know when the task has ended.

## Request

### HTTP Method
Again, this is an _unsafe_ and a _non-idempotent_ operation. We will use `POST` to create the task (aka add the task to the collection of tasks).

### Entity body
Will be the actual resource we want to create, for example an `operation`.

### Example
```
POST /operations/tasks HTTP/1.1
Content-Type: application/json

{"title": "This is my first operation", "description": "Description of the operation"}
```

## Response
A `202 (Accepted)` plus a `Content-Location: /products/tasks/THE_TASK_ID` will be returned. Now we can read that `task` resource to know its completion status.

* If the `operation` resource is not ready, it will return `200` and a json with a completion status of `pending`.
* When the `operation` resource is ready, it will return a `303`, with a `Location` header pointing to the `operation` resource, and a body with a json with a completion status of `done`.

Optionally, if our task has created several resources, it might return a body with a list of resources, as in:

```
[
    {"name": "name 1", "links": [{"rel": "self", "href": "/products/1"}]},
    {"name": "name 2", "links": [{"rel": "self", "href": "/products/1"}]}
]
```

## Delete asynchronous
Same procedure applies when a `DELETE` takes too long to carry it out synchronosly: we will create a new task resource to be able to query its completion status.
