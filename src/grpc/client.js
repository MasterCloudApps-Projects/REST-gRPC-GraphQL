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
        case 'GetArticle':
            client.getArticle({id: process.argv[3]}, function(err, article) {
                if (err) {
                    console.log('GetArticle Error', err);
                } else {
                    console.log('GetArticle', article);
                }
            });
            break;
        case 'ListArticles':
            client.listArticles({page_size: 10, page_token: process.argv[3]}, function(err, articles) {
                if (err) {
                    console.log('ListArticles Error', err);
                } else {
                    console.log('ListArticles', articles);
                }
            });
            break;
        case 'CreateArticle':
            client.createArticle({article: {title: process.argv[3], description: process.argv[4]}}, function(err, article) {
                if (err) {
                    console.log('CreateArticle Error', err);
                } else {
                    console.log('CreateArticle', article);
                }
            })
            break;
        default:
            throw new Error("Unknown operation: " + operation);
    }
}

main();
