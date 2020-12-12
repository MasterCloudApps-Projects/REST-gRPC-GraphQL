# Implementation
This node.js project is a small demo of how to implement many of the functional requirements present in everyday APIs we use.

It covers the following API Styles:

* REST: see [`rest` folder](./rest/).
* GraphQL: see [`graphql` folder](./graphql/).
* gRPC: see [`grpc` folder](./grpc/).

It has been developed using:

* [express](https://github.com/expressjs/expressjs.com) as the main app server.
* [apollo-server-express](https://github.com/apollographql/apollo-server), as an express middleware.
* [mongoose](https://github.com/Automattic/mongoose), to model and access MongoDB objects.
* [nodemon](https://nodemon.io/), to simplify the development process.
* [@grpc/grpc-js](https://github.com/grpc/grpc-node/tree/master/packages/grpc-js), a pure JavaScript gRPC client.
* [cors](https://github.com/expressjs/cors), an Express middleware to add CORS support to a web service.
* [got](https://github.com/sindresorhus/got), an HTTP client for node.js, used for WebHooks.

To install the dependencies, run `npm install`.

Then configure your MongoDB in `nodemon.json`.

To run the project, exec `npm start`.

Finally, to turn to grpc client on, exec `npm run grpcc`.

Also note, the GraphQL service has the [graphiql](https://github.com/graphql/graphiql) web interface enabled for your convenience. It's available in `/graphql`.
