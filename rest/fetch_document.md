# Fetch a document

To fetch a single document resource in a RESTful Web Service, we need to consider several things:

* Which HTTP method is the more apropriate.
* How we identify the resource.
* How we represent the resource.

## HTTP method
A fetching does not have side effects, so it is both a safe and an idempotent operation. Besides, the underneath semantic matches that of `GET`. So for this we will use `GET`.

## Identifier
REST identifiers are _opaque_, so technically this is a perfectly valid identifier for a document of a product:

```/33b27e35-8f1a-4e05-8c4a-e36a90cffd9b```

However, if we want to stick to the most commonly used name standard, we will something like this instead:

```/products/12```

## Representation of a resource
With REST, a client can use HTTP to negotiate how the want to receive the representation of the state of a resource, as long as the server supports several Media Types.

Most of the time, the resources will be represented using a meta-language, using either XML, JSON or YAML. Some people argue that this feature of REST is not that useful, since most modern programming languages can easily handle all those formats.

### `Accept` HTTP header
To negotiate the representation of a resource, the client may suggest its preference to the server using the `Accept` header, as in `Accept: application/json, text/plain, */*;q=0.8`.


## Custom Fetch
Sometimes, when fetching a document or a collection, we are only interested in a small set of information of the full resource. Other times, though, we want our response representation to be expanded by including nested resources. Of course, we can always define new representations, so that one representation returns a JSON of a resource, another one returns a basic representation of the same resource, and a third one includes some of its nested resources. This way, clients just need to rely on [content negotiation](#representation-of-a-resource) to select the desired representation. However, this would not allow REST clients to request only the required fieldset for their operation.

### Sparse Fieldsets
This technique aims to reduce the load on the backend and in the network by decreasing the number of fields in the returned representation of a resource. By default, the _full representation_ will be returned. Clients are also able to specify which fields they are insterested in:

```
GET /resources?fields[]=field1&fields[]=field2
```

#### Embedded Resources
Some resources contain relations to other resources. For example, a _blog post_ might contain a relation to a _user_ and to a _collection of comments_. The default JSON representation of a blog post might not contain those related resources, thus forcing REST clients to run new queries to the API. In order to avoid this, some APIs let users auto-load embedded resources.

For example, the following request might return the blog post #12 along with its author and all its comments:

```
GET /posts/12?embed[]=comments&embed[]=author
```

Note that this technique can be use together with Sparse Fieldsets, so that a client app is allowed to specify not just the embedded resources but also the fields of those resouces. For example, the command above can be updated to select only the `name` field from the author:

```
GET /posts/12?embed[]=comments&embed[]=author.name
```

#### Real World Examples of Custom Fetch
This technique has a wide adoption:

* [Google Tasks API][Partial response in Google Tasks API] recommends using _partial responses_ to improve the performance.
* JSON API specification has a section about [Sparse Fieldsets][JSON API Sparse Fieldsets].



## Example
To fetch a document run any of the following, you first need its id. Run:

```
curl http://localhost:4000/articles
```

Select any of the articles ids and then:

```
curl -v http://localhost:4000/articles/5fa95ab13e06593195951418
```

The above request will return the selected article in the default Media Type (`application/json`):

```
{
    "title": "Title 2",
    "description": "Description 2"
}
```

In order to fetch in other Media Type (for example, `text/plain`):

```
curl -v --header "Accept: text/plain" http://localhost:4000/article/5fa95ab13e06593195951418
```

Which might return something like:

```
This is the text/plain representation of the article #5fa95ab13e06593195951418
```

The `article` resource also accepts sparse fieldsets. We can choose between `title`, `description`, `createdAt`, `updatedAt`, `comments`.

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
