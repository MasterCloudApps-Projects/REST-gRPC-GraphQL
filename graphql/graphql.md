# GraphQL

To read: [Why GitHub adopted GraphQL instead of REST](https://github.blog/2016-09-14-the-github-graphql-api/).

## Error handling
* https://www.apollographql.com/docs/apollo-server/data/errors/
* customFormatErrorFn en https://www.npmjs.com/package/express-graphql
* https://codeburst.io/custom-errors-and-error-reporting-in-graphql-bbd398272aeb
* https://medium.com/@koistya/validation-and-user-errors-in-graphql-mutations-39ca79cd00bf

graphql responses contain an object:

```
{
    "data": {the_data},
    "errors: [
        first_error
    ]
}
```

### Example
Example, github. When trying to remove an non-existing issue

```
mutation {
  deleteIssue(input: {issueId:5}) {
    repository {
      name
    }
  }
}

```

it returns this:

```
{
  "data": {
    "deleteIssue": null
  },
  "errors": [
    {
      "type": "NOT_FOUND",
      "path": [
        "deleteIssue"
      ],
      "locations": [
        {
          "line": 2,
          "column": 3
        }
      ],
      "message": "Could not resolve to a node with the global id of '5'"
    }
  ]
}
```
