module.exports = function getDistance(call, callback) {
    callback(
        null,
        {
            from: call.request.from,
            to: call.request.to,
            km: 500
        }
    );
}
