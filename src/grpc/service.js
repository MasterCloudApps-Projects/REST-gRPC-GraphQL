var PROTO_PATH = __dirname + '/proto/schema.proto';

var grpc = require('@grpc/grpc-js');
var protoLoader = require('@grpc/proto-loader');

var packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    }
);
var example_proto = grpc.loadPackageDefinition(packageDefinition).example;

function getDistance(call, callback) {
    callback(
        null,
        {
            from: call.request.from,
            to: call.request.to,
            km: 500
        }
    );
}

module.exports = () => {
    var server = new grpc.Server();
    server.addService(
        example_proto.Main.service,
        {
            GetDistance: getDistance,
        }
    );
    const PORT = 50051;
    server.bindAsync(
        `0.0.0.0:${PORT}`,
        grpc.ServerCredentials.createInsecure(),
        () => {
            console.log(`🚀 Subscriptions ready at http://localhost:${PORT}`);
            server.start();
        }
    );
}
