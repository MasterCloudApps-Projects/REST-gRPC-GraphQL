# Custom Fetch
Sometimes, when fetching a document or a collection, we are only interested in a small set of information of the full resource. Other times, though, we want our response representation to be expanded by including nested resources. Of course, we can always define new representations, so that one representation returns a JSON of a resource, another one returns a basic representation of the same resource, and a third one includes some of its nested resources. This way, clients just need to rely on [content negotiation](../fetch_specific_format/README.md) to select the desired representation. However, this would not allow REST clients to request only the required fieldset for their operation.

## Sparse Fieldsets
This technique aims to reduce the load on the backend and in the network by decreasing the number of fields in the returned representation of a resource. By default, the _full representation_ will be returned. Clients are also able to specify which fields they are insterested in:

```
GET /resources?fields[]=field1&fields[]=field2
```

### Embedded Resources
Some resources contain relations to other resources. For example, a _blog post_ might contain a relation to a _user_ and to a _collection of comments_. The default JSON representation of a blog post might not contain those related resources, thus forcing REST clients to run new queries to the API. In order to avoid this, some APIs let users auto-load embedded resources.

For example, the following request might return the blog post #12 along with its author and all its comments:

```
GET /posts/12?embed[]=comments&embed[]=author
```

Note that this technique can be use together with Sparse Fieldsets, so that a client app is allowed to specify not just the embedded resources but also the fields of those resouces. For example, the command above can be updated to select only the `name` field from the author:

```
GET /posts/12?embed[]=comments&embed[]=author.name
```

### Real World Examples
This technique has a wide adoption:

* [Google Tasks API][Partial response in Google Tasks API] recommends using _partial responses_ to improve the performance.
* JSON API specification has a section about [Sparse Fieldsets][JSON API Sparse Fieldsets].

## Code example
Example project contains 100 articles pre-created, each one with 5 comments. To fetch them, run:

```
curl "http://localhost:4000/articles"
```

Now, to fetch a specific article, we can:

```
curl "http://localhost:4000/articles/5fa86e4fd3ec9e5eb38447a1"
```

The above would have returned something like this:

```
{
  "title": "Title 100",
  "description": "Description 100"
}

```

This resource accepts sparse fieldsets. We can choose between `title`, `description`, `createdAt`, `updatedAt`, `comments`.

```
curl "http://localhost:4000/articles/5fa86e4fd3ec9e5eb38447a1?fields[]=title&fields=comments"
```

Which will return something like:

```
{
  "title":"Title 100",
  "comments":[
    {"id":"5fa86f33558bab6f3f048dce","author":"Author 0","text":"Comment text 0"},
    {"id":"5fa86f33558bab6f3f048dcf","author":"Author 1","text":"Comment text 1"},
    {"id":"5fa86f33558bab6f3f048dd0","author":"Author 2","text":"Comment text 2"},
    {"id":"5fa86f33558bab6f3f048dd1","author":"Author 3","text":"Comment text 3"},
    {"id":"5fa86f33558bab6f3f048dd2","author":"Author 4","text":"Comment text 4"}
  ]
}
```

Note that among those fields we find simple, scalar fields (like `id` or `author`) and embedded fields (like `comments`).

[Partial response in Google Tasks API]: https://developers.google.com/tasks/performance#partial-response
[JSON API Sparse Fieldsets]: https://jsonapi.org/format/#fetching-sparse-fieldsets
