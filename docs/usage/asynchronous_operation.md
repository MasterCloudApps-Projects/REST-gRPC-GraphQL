# Asynchronous operations
Sometimes an API call might take a long time to be completed, so that a synchronous answer is not possible at all. This is a challenging operation that should be effectively tackled.

## REST
Let's first analyze the creation of a resource that takes too long. In this case, we will define a brand new resource, called `task`, that will represent the task to create our slow-resource, for example, a `video`. So, whenever an application wants to create a new `video`, it will actually create a new resource of type `task`. This will contain a `status` field to let us know when it has finished.

As with regular creation requests, will use `POST` to create the task (i.e. we will add a task to the collection of tasks).

The body of the task will be the actual resource we want to create, for example a `video`. A `202 (Accepted)` plus a `Content-Location: /THE_TASK_IDENTIFIER` will be returned.

Now we can read that `task` resource to know its completion status.

* If the `operation` resource is not ready, it will return `200` and a json with a completion status of `pending`.
* When the `operation` resource is ready, it will return a `303`, with a `Location` header pointing to the `operation` resource, and a body with a json with a completion status of `done`.

Optionally, if our task has created several resources, it might return a body with a list of resources, as in:

```
[
    {"name": "name 1", "links": [{"rel": "self", "href": "/identifier_resource_1"}]},
    {"name": "name 2", "links": [{"rel": "self", "href": "/identifier_resource_2"}]}
]
```

When it comes to delete instead of create, same steps apply: when a `DELETE` takes too long to carry it out synchronously, we will create a new task resource to be able to query its completion status.

## GraphQL
TODO

## gRPC
TODO
Recommendation: use the `Operation` interface: https://cloud.google.com/apis/design/design_patterns#long_running_operations

## External Resources
* [Google Cloud pattern for Long Running Operations](https://cloud.google.com/apis/design/design_patterns#long_running_operations)

## Source code

### REST
Example source code contains a `video` model. Processing a new video is an slow operation. To publish a new resource of type `video`, a `videoTask` needs to be created:

```
curl -v --header "Content-Type: application/json" \
--request POST \
--data '{ "title": "My movie", "plot": "Plot of the movie I'm about to render" }' \
http://localhost:4000/videos/tasks
```

It will return a task id in the `Content-Location` header, as in `/videos/tasks/5fa980589e12c15ccc8f4269`. To fetch the task, run:

```
curl -v -X GET http://localhost:4000/video/tasks/5fa980589e12c15ccc8f4269
```

 * If the operation is not ready, you'll get `200 {"status": "pending"}`
 * Otherwise, a `303 {"status": "done"}`, with a `Location: /videos/5fa981689e12c15ccc8f427a` will be returned.

Now the video can be retrieved:

```
curl -v -X GET http://localhost:4000/videos/5fa981689e12c15ccc8f427a
```

## GraphQL
TODO