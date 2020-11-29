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

function main() {
    var client = new example_proto.Main('localhost:50051', grpc.credentials.createInsecure());
    var operation;
    if (process.argv.length >= 3) {
        operation = process.argv[2];
    } else {
        throw new Error("Missing operation");
    }

    switch (operation) {
        case 'GetDistance':
            client.getDistance({from: "Madrid", to: "Barcelona"}, function(err, {from, to, km}) {
                console.log(`Distance from ${from} to ${to}: ${km}Km`);
            });
            break;
        default:
            throw new Error("Unknown operation: " + operation);
    }
}

main();
