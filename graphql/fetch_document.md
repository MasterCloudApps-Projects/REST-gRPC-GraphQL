# Fetch document

## Theory

## Example

To fetch an article, we first need to know which `article` we want to fetch. So, to fetch the `id` of the first `article`, we can run this query:

```
query {
    articles(first: 1) {
    edges {
      node {
        id
      }
    }
  }
}
```

The above will return an `article` `id`. To fetch it, we can:

```
query {
    article(id: "5fa991f18ca8e61b0f8c7d43") {
        id
    	title
    	description
    }
}
```

Which will return the info from the field:

```
{
  "data": {
    "article": {
      "id": "5fa991f18ca8e61b0f8c7d43",
      "title": "Title 1",
      "description": "Description 1"
    }
  }
}
```
