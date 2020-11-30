
var PROTO_PATH = __dirname + '/proto/schema.proto';

const Article = require("../models/article");
const Comment = require("../models/comment");
const Client = require('../models/client');
var grpc = require('@grpc/grpc-js');
var protoLoader = require('@grpc/proto-loader');
var jsonwebtoken = require('jsonwebtoken');

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

async function getClient(call, callback) {
    try {
        jsonwebtoken.verify(call.metadata.get('authorization')[0], process.env.ACCESS_TOKEN_SECRET);
    } catch (jsonWebTokenError) {
        return callback({
            code: grpc.status.UNAUTHENTICATED,
            message: jsonWebTokenError.message,
        });
    }

    const clientFetched = await Client.findOne({dni: call.request.dni});
    if (clientFetched) {
        callback(null, {
            dni: clientFetched.dni,
            iban: clientFetched.iban
        });
    } else {
        return callback({
            code: grpc.status.NOT_FOUND,
            message: "Client not found",
        });
    }

}

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

async function listArticles(call, callback) {
    const getFromCondition = function(after) {
        if (after == undefined || after == "") {
            return {};
        }
        return {'_id': {'$gt': after}}
    }
    const getLimitValue = (limit) => Math.min(20, parseInt(limit)) || 10;

    let articles = await Article
        .find(getFromCondition(call.request.page_token))
        .limit(getLimitValue(call.request.size));
    const nextPageToken = articles.length ? articles[articles.length - 1].id : null;
    callback(
        null,
        {
            articles,
            next_page_token: nextPageToken,
        }
    )
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

async function createArticle(call, callback) {
    const article = new Article(call.request.article);
    const newArticle = await article.save();
    callback(null, {
        id: newArticle.id,
        title: newArticle.title,
        description: newArticle.description,
        comments: []
    });
}

async function deleteArticle(call, callback) {
    const id = call.request.id;
    const deletedArticle = await Article.findByIdAndDelete(id);
    if (!deletedArticle) {
        return callback({
            code: grpc.status.NOT_FOUND,
            message: `Article ${id} not found`,
        });
    }

    callback();
}

module.exports = () => {
    var server = new grpc.Server();
    server.addService(
        example_proto.Main.service,
        {
            GetDistance: getDistance,
            GetArticle: getArticle,
            ListArticles: listArticles,
            CreateArticle: createArticle,
            DeleteArticle: deleteArticle,
            GetClient: getClient,
        }
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
