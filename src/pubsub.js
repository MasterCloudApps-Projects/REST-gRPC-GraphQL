const { PubSub } = require('apollo-server-express');

const NEW_ARTICLE = 'NEW_ARTICLE';

class MyPubSub {
    constructor(){
        this.pubsub = new PubSub();
    }

    getNewArticleAsyncIterator() {
        return this.asyncIterator([NEW_ARTICLE])
    }
  
    asyncIterator(param) {
        return this.pubsub.asyncIterator(param);
    }

    publishNewArticle(newArticle) {
        return this.publish(NEW_ARTICLE, {newArticle});
    }

    publish(topic, message) {
        return this.pubsub.publish(topic, message);
    }
}
  
const instance = new MyPubSub();
Object.freeze(instance);
  
module.exports = instance;
