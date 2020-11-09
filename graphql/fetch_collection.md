# Fetch Collection

## Theory

https://graphql.org/learn/pagination/

Una especificación muy común es la de Relay: https://relay.dev/graphql/connections.htm

## Example
In this example, 100 articles have been created. To fetch them, run:

```
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

```
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

```
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

```
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
