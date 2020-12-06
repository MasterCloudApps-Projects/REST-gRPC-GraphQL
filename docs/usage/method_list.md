# Standard method: list
In addition to fetching a single document, we need to be able to fetch a list of documents: a _collection_. In simplest clases, a colection will never contain many elements: for example, professors for a given department. However, when collections can become arbitrarily large, for example with mail messages in a mailbox, we need to be able to specify which elements we are interested in. In this case, we will use pagination, sorting and optionally filtering.

To provide pagination, two main approaches are followed:

* **Offset-based pagination** - A fixed position, or _offset_, is given to the query of the collection.
* **Cursor-based pagination** - An identifier for the first item, or _cursor_, is given to the query of the collection. This strategy is more popular nowadays, because the cursor is opaque and promotes evolution of the API.

When using pagination, a _sorting mechanism_ should be used. Typically, our data will be backed in a datasore, like a database, with indices and keys. A public id can be used to paginate, but other options can be provided. For example, we can let our users sort our collection by a date field.

## REST
As it happened with simple resources, or _documents_, to fetch a _collection resource_ `GET` can be used.

### Pagination and sorting
The two main strategies can be used:

* **Offset-based pagination** - as in `GET /universities?limit=10&offset=30`.
* **Cursor-based pagination** - as in `GET /universities?limit=10&next=uc3m`.

The returned resultset can also contain `Web Links` headers to help traversing the rest of the collection.

To sort the results, we can use query parameters as well: `GET /univerisities?limit=10&offset=20&sort-by=establishment-date`.

### Filtering
To filter the resultset, query parameters can be used as well. This technique includes basic filtering, like this:

```
GET /universities?country=spain
```

But also more advanced filters, making use of operands, for example using something like the following:

```
GET /universities?country[neq]=spain
```

### Real World Examples

* [Cursor-based pagination in Facebook API][]
* [Pagination with Web Links in GitHub API][]
* [OData Querying Collections][]

## GraphQL
GraphQL gives total freedom to implementers on how they design their queries to collections.

### Pagination and sorting
With regard to pagination, both approaches, offset-based and cursor-based, can be used. However, most people, even the [Official GraphQL documentation][GraphQL: Pagination], recommend following a specific pattern: the [GraphQL Cursor Connections Specification][]. The collection will return an object like this:

```json
{
    "pageInfo": {
        "hasNextPage": "<boolean>",
        "hasPreviousPage": "<boolean>",
        "startCursor": "<opaque cursor to the first one>",
        "endCursor": "<opaque cursor to the last one>"
    },
    "edges": [
        {
            "cursor": "<opaque cursor of this node>",
            "node": "<object with this node representation>",
        },
        {
            "cursor": "<opaque cursor of this node>",
            "node": "<object with this node representation>",
        }
    ]
}
```

And the collection query would accept several arguments. In case of foward-pagination:

* `first`: non-negative number
* `after`: cursor

And in case of backard-pagination:
* `last`: non-negative number
* `before`: cursor


As in:

```graphql
type ProductEdge {
    cursor: String!
    node: Product!
}
type ProductsPayload {
    edges: [ProductEdge]!
    pageInfo: PageInfo!
    totalCount: Int!
}
type PageInfo {
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    startCursor: String
    endCursor: String
}
type Query {
    products(after: String, first: Int, before: String, last: Int): ProductsPayload
}
```

Note that, in addition to the fields required by the Connections Specification, a `totalCount` might be added.

The Connections Specification does not state anything about how to order the results. So a query might have a predefined sorting field, but also allow to specify another field, for example via an optional argument.

### Filtering
GraphQL _queries_ accept arguments. These can be used also to filter arguments. This filtering can be basic, as in:

```graphql
query {
    products(type: FURNITURE) {
        totalCount
    }
}
```

More advanced patterns can be also used, as in:

```graphql
query {
    products(
        where: {
            price: {
                _gt: 200
            }
        }
    ) {
        totalCount
    }
}
```

### Real World Examples
* [Relay][Relay: Pagination container], the JS framework for react app powered by GraphQL, uses the Connection Specification.
* [Hasura: Filter query results][Hasura: Filter query results], the engine that easily provides a GraphQL server from existing databases, allows the use of advance search operators.

## gRPC

### Pagination and sorting
Google Cloud API Design Guide recommends that every [List operation]() contains [cursor-based pagination](https://cloud.google.com/apis/design/design_patterns#list_pagination) and [result ordering](https://cloud.google.com/apis/design/design_patterns#sorting_order) from the beginning-

```proto
rpc ListArticle(ListArticlesRequest) returns (ListArticlesResponse);

message ListArticlesRequest {
  int32 page_size = 1;
  string page_token = 2;
  string order_by = 3;
}

message ListArticlesResponse {
  repeated Article articles = 1;
  string next_page_token = 2;
}
```

The `order_by` will be like the SQL `ORDER BY`, so that it accepts several fields and sorting criteria, as in `id, name desc`.

### Filtering
To perform a filtering, gRPC suggest we use a custom method `Search` instead of `List`. In this case, a custom implementation will be done. [Some Google services](https://cloud.google.com/service-infrastructure/docs/service-consumer-management/reference/rest/v1/services/search) use a `query` string argument that accepts its own query definition, as in `field_name=literal_string`.

## Source code
The blog-like repository in the sample code supports traversing the articles collection:

### REST
In this example, 100 articles have been created. To fetch them, run:

```
curl http://localhost:4000/articles
```

Note that only 10 have been returned. A default limit of 10 has been set. To set another limit, use:

```
curl http://localhost:4000/articles?limit=20
```

The default offset is 0. To specify it (note the double quotes):

```
curl "http://localhost:4000/articles?limit=20&offset=30"
```

To see the `WebLinks` generated by this example, see the `Link` header after running:

```
curl -v "http://localhost:4000/articles?limit=20&offset=30"
```

### GraphQL
In this example, 100 articles have been created. To fetch them, run:

```graphql
query {
  articles {
    edges {
      node {
        title
      }
    }
  }
}
```

As in:

```
curl -H "Content-Type: application/json" \
    -d '{ "query": "query { articles { edges { node { title } } } }" }' \
    http://localhost:4000/graphql
```

Note that only 10 have been returned. A default limit of 10 has been set. To set another limit, use:

```graphql
query {
    articles(first: 20) {
        edges {
            cursor
            node {
                title
            }
        }
    }
}
```

Now, note we have now included _cursors_ in our request. These will be required to paginate throughout the resultset. The default cursor is the first item. To specify another, use (replacing the cursor id):

```graphql
query {
    articles(first: 20, after: "5fa80c365fcbc87a96a7ebc5") {
        edges {
            cursor
            node {
                title
            }
        }
    }
}
```

To see more navigational info about our cursor, we can fetch the `totalCount` and the `pageInfo` document:

```graphql
query {
    articles(first: 20, after: "5fa80c365fcbc87a96a7ebc5") {
    		totalCount
    		pageInfo {
      			endCursor
      			hasNextPage
    		}
        edges {
            cursor
            node {
                title
            }
        }
    }
}
```

### gRPC
A new `rpc` has been created. It accepts a request object to configure the pagination, and returns a response object that contains the next cursor, as well as a list of articles:

```proto
rpc ListArticles(ListArticlesRequest) returns (ListArticlesResponse);

message ListArticlesRequest {
    int32 page_size = 1;
    optional string page_token = 2;
}

message ListArticlesResponse {
    message BasicArticle {
        string id = 1;
        string title = 2;
        string description = 3;
    }
    repeated BasicArticle articles = 1;
    string next_page_token = 2;
}
```

To exercute it, run the gprc client, `npm run grpcc`, and then:

```js
client.ListArticles({}, pr)
```

Then, to get from a specific page, set a valid article id, as in:

```js
client.ListArticles({page_token:'5fc3ffe378b3dd2565ed83f3'}, pr)
```

## Resources
* [Cursor-based pagination in Facebook API][]
* [Pagination with Web Links in GitHub API][]
* [OData Querying Collections][]
* [GraphQL: Pagination][]
* [GraphQL Cursor Connections Specification][]
* [Relay](https://relay.dev/)
* [Hasura](https://hasura.io/)

[Cursor-based pagination in Facebook API]: https://developers.facebook.com/docs/graph-api/using-graph-api/#paging
[Pagination with Web Links in GitHub API]: https://docs.github.com/en/free-pro-team@latest/rest/guides/traversing-with-pagination
[OData Querying Collections]: http://docs.oasis-open.org/odata/odata/v4.01/odata-v4.01-part1-protocol.html#_Toc31358947
[GraphQL: Pagination]: https://graphql.org/learn/pagination/
[GraphQL Cursor Connections Specification]: https://relay.dev/graphql/connections.htm
[Hasura: Filter query results]: https://hasura.io/docs/1.0/graphql/core/queries/query-filters.html
[Relay: Pagination container]: https://relay.dev/docs/en/pagination-container