const pubsub = require("../pubsub");

const got = require('got');

module.exports.start = async function () {
    for await (const article of pubsub.getNewArticleAsyncIterator()) {
        const {body} = await got.post(process.env.WEBHOOK_URL, {
	    	body: JSON.stringify(article)
        });
        console.log("⚡ response from remote webhook: ", body);
    }
}
