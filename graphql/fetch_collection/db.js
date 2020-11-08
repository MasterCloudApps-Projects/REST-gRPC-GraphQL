const Article = require('./models/article');

async function createArticle(id) {
    let article = new Article({
        title: `Title ${id}`,
        description: `Description ${id}`
    });
    await article.save();
}

module.exports = async function createArticles(num) {
    await Article.deleteMany();
    for (let i = 1; i <= num; i++) {
        await createArticle(i);
    }
}
