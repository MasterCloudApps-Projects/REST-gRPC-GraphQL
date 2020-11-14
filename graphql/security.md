# Security
TODO: See REST, as same rules apply

## Example
Let's try to access a `client`, which is restricted resource, without any authorization mechanism:

```
curl -X POST -H "Content-Type: application/json" \
    -d '{"query": "{client(dni:\"06580190M\") {iban} }"}' \
    http://localhost:4000/graphql
```

We will get this error message: `Access restricted. Please, provide a valid access token`. To get an `accessToken`, we need to login:

```
curl -v -H "Content-Type: application/json" \
    -X POST -d '{"username": "pepe", "password":"secret"}'
    http://localhost:4000/login
```

Once we have the `accessToken`, we will set it in the `Authorization` header using the `Bearer` scheme:

```
curl -X POST -H "Content-Type: application/json" \
    -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InBlcGUiLCJpYXQiOjE2MDUzNzkyMzh9.qo2ovz3Zm99OQH_rcAqEsPiYfKBlfKpmnDlXHjBNzkk" \
    -d '{"query": "{client(dni:\"06580190M\") {iban} }"}' \
    http://localhost:4000/graphql
```

Now, the client private data has been returned:

```json
{
    "dni": "06580190M",
    "IBAN": "ES4404877434913522416372"}
}
```

In addition, CORS is also enabled. For example, if we run this query:

```
curl -X POST -v -H "Content-Type: application/json" \
    -d '{"query": "{articles {totalCount}}"}' \
    http://localhost:4000/graphql
```

We will get a `Access-Control-Allow-Origin: http://localhost:4000/` response header.
