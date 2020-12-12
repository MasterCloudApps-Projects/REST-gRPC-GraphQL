const article = require('./article');
const distance = require('./distance');
const video = require('./video');
const client = require('./client');

require('./webHookHandler').start();

module.exports = {
    article,
    distance,
    video,
    client
};
