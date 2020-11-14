const Article = require('./models/article');
const Comment = require('./models/comment');
const Client = require('./models/client');

async function createArticle(id) {
    let article = new Article({
        title: `Title ${id}`,
        description: `Description ${id}`
    });
    await article.save();
    for (let i = 0; i < 5; i++) {
        comment = new Comment({
            author: `Author ${i}`,
            text: `Comment text ${i}`,
            article: article._id
        });
        await comment.save();
    }
}

async function createArticles(num) {
    await Article.deleteMany();
    await Comment.deleteMany();
    for (let i = 1; i <= num; i++) {
        await createArticle(i);
    }
}

async function createClient(dni, iban) {
    let client = new Client({dni, iban});
    await client.save();
}

async function createClients() {
    await Client.deleteMany();
    await createClient("06580190M", "ES4404877434913522416372");
    await createClient("25705158J", "ES3121006658118742431683");
    await createClient("31156553V", "ES8614654119472154778266");
}

module.exports = async function(numArticles) {
    await createArticles(numArticles);
    await createClients();
}
