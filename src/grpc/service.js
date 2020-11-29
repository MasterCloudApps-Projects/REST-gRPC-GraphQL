
var PROTO_PATH = __dirname + '/proto/schema.proto';

const Article = require("../models/article");
const Comment = require("../models/comment");
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

async function getArticle(call, callback) {
    const id = call.request.id;
    const article = await Article.findById(id);
    let response = null;
    let error = null;
    const comments = await Comment.find({ article: id })
    if (article) {
        response = {
            id,
            title: article.title,
            description: article.description,
            comments: comments.map(({author, text}) => ({author, text}))
        }
    } else {
        return callback({
            code: grpc.status.NOT_FOUND,
            message: `Article ${id} not found`,
        });
    }
    callback(
        error,
        response
    )

}

module.exports = () => {
    var server = new grpc.Server();
    server.addService(
        example_proto.Main.service,
        {
            GetDistance: getDistance,
            GetArticle: getArticle
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
