# Add a document to a collection

## Theory

## Example

To create a new `article`, run:

```
mutation {
    createArticle(article: {
        title:"This is the title",
        description:"This is the description"
    }) {
        id
    }
}
```

The above request will return the id of the newly created resource. To fetch the resource, you can run:

```
query {
    article(id:"5fa9941a8067e43ad0d79e88") {
        id
        title
        description
    }
}
```
