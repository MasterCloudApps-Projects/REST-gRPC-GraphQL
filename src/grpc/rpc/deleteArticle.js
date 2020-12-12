const Article = require("../../models/article");
var grpc = require('@grpc/grpc-js');

module.exports = async function deleteArticle(call, callback) {
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
