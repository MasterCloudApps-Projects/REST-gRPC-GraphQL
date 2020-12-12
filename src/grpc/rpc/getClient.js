var jsonwebtoken = require('jsonwebtoken');
const Client = require('../../models/client');
var grpc = require('@grpc/grpc-js');

module.exports = async function getClient(call, callback) {
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