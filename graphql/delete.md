# Delete

## Theory

## Example
To create a new entry, run:

```
mutation {
    createArticle(
        article: {
            title: "This is my first post",
            description: "This is the beginning of a beautiful friendship"
        }
    ) {
        id
    }
}
```

The above request will return the id of the newly created resource. To fetch the resource, you can run:

```
query {
    article(id: "5fa5cb0c38137b23c1ac82c4") { id, title }
}
```

To remove it, let's exercise the following mutation `deleteArticle(id: ID!): Article`:

```
mutation {
    deleteArticle(id: "5fa6d242bc92b1350046395d" ) { id }
}
```
