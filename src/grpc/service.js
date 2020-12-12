var grpc = require('@grpc/grpc-js');
var protoLoader = require('@grpc/proto-loader');

const PROTO_PATH = __dirname + '/proto/schema.proto';
const packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    }
);
var proto = grpc.loadPackageDefinition(packageDefinition).example;

module.exports = () => {
    var server = new grpc.Server();
    server.addService(
        proto.Main.service,
        require("./serviceImplementation")
    );
    const PORT = 50051;
    server.bindAsync(
        `0.0.0.0:${PORT}`,
        grpc.ServerCredentials.createInsecure(),
        () => {
            console.log(`🚀 gRPC ready at http://localhost:${PORT}`);
            server.start();
        }
    );
}
