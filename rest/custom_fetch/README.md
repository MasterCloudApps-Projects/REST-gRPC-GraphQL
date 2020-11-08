# Custom Fetch
Sometimes, when fetching a document or a collection, we are only interested in a small set of information of the full resource. Other times, though, we want our response representation to be expanded by including nested resources. Of course, we can always define new representations, so that one representation returns a JSON of a resource, another one returns a basic representation of the same resource, and a third one includes some of its nested resources. This way, clients just need to rely on [content negotiation](../fetch_specific_format/README.md) to select the desired representation. However, this would not allow REST clients to request only the required fieldset for their operation.

## Sparse Fieldsets
This technique aims to reduce the load on the backend and in the network by decreasing the number of fields in the returned representation of a resource. By default, the _full representation_ will be returned. Clients are also able to specify which fields they are insterested in:

```
GET /universities?fields[]=id&fields[]=name
```

### Embedded Resources
Some resources contain relations to other resources. For example, a _blog post_ might contain a relation to a _user_ and to a _collection of comments_. The default JSON representation of a blog post might not contain those related resources, thus forcing REST clients to run new queries to the API. In order to avoid this, some APIs let users auto-load embedded resources.

For example, the following request might return the blog post #12 along with its author and all its comments:

```
GET /posts/12?embed[]=comments&embed[]=author
```

Note that this technique can be include Sparse Fieldsets also in embedded resources, so that users are allowed to specify not just the embedded resources but also the fields of those resouces. For example, the example above can be updated to select only the name field from the author:

```
GET /posts/12?embed[]=comments&embed[]=author.name
```

### Real World Examples
This technique has a wide adoption:

* [Google Tasks API][Partial response in Google Tasks API] recommends using _partial responses_ to improve the performance.
* JSON API specification has a section about [Sparse Fieldsets][JSON API Sparse Fieldsets].

[Partial response in Google Tasks API]: https://developers.google.com/tasks/performance#partial-response
[JSON API Sparse Fieldsets]: https://jsonapi.org/format/#fetching-sparse-fieldsets
