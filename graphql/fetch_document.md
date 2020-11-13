# Fetch document

## Theory
TODO - Show:
* how to fetch custom fields
* how to fetch embedded resources

Note:
* You cannot shape the response of a query: https://www.fourkitchens.com/blog/development/graphql-leveler-controlling-shape-query/
* But you can use [aliases][Aliases] to disambiguate two queries. Yes, we can send two queries at once.

[Aliases]: https://graphql.org/learn/queries/#aliases


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

Note that it has returned the fields we have requested. This is a key feature of graphql that is not natively supported in REST.

We can also include embedded resources:

```
query {
    article(id:"5fa991f18ca8e61b0f8c7d43") {
        comments {
            author
        }
    }
}
```

And we will get something like this:

```
{
    "data": {
        "article": {
            "comments": [
                {"author": "Author 0"},
                {"author": "Author 1"},
                {"author": "Author 2"},
                {"author": "Author 3"},
                {"author": "Author 4"}
            ]
        }
    }
}
```

Finally, in addition to specify custom fields (whether they are composed or scalar types), we can also set _aliases_ to tell apart two elements of the same type:

```
query {
  art1:article(id:"5fa9b07da5b7d93867f0634e") {
    comments {
      author
    }
  }
  art2:article(id:"5fa9b07da5b7d93867f06354") {
    title
  }
}
```

Here, we execute two queries of the type `article()`, each one returning a different result.
