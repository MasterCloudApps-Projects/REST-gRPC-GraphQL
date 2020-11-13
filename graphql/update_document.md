# Update document in a collection

## Operation
For this, a _mutation_ is used. In this case, as in a `PUT` operation in REST, a full replacement will be done. So, the _mutation_ will receive as an argument the new state of the resource, as in the following definition:

```graphql
    type Mutation {
        updateProduct(id: ID!, product:ProductInput!): Product
    }
```

That can be used like this:

```graphql
mutation UpdateFullProduct($product:ProductInput!) {
    updateProduct(product: $product) {
        id
        price
    }
}
```

Variables:

```json
{
    "product": {
        "id": 5,
        "name": "Smartphone",
        "price": 350
    }
}
```

Note that the _operation_ has been named `UpdateFullProduct`; an _operation_ might contain several _mutations_, so this is a convenient way to wrap them in a structure similar to a function. Also note that the _mutations_ within are run in series. We can define variables to invoke this operation.

Also note that since our _mutation_ `updateProduct` returns a `Product`, we can ask for the specific fields we are interested in, as we do with _queries_.

## Example
To update an article in our example, we can run this operation:

```graphql
mutation UpdateArticle($id:ID!, $article:ArticleInput!) {
  updateArticle(id:$id,article:$article) {
    title
    description
  }
}
```

With these variables:

```json
{
  "id": "5faeed572bbb8d6e218829c7",
  "article": {
    "title": "New title",
    "description": "New description"
  }
}
```
