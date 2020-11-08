const Article = require('./models/article');
const Comment = require('./models/comment');

async function createArticle(id) {
    let article = new Article({
        title: `Title ${id}`,
        description: `Description ${id}`
    });
    await article.save();
    console.log(article);
    for (let i = 0; i < 5; i++) {
        comment = new Comment({
            author: `Author ${i}`,
            text: `Comment text ${i}`,
            article: article._id
        });
        await comment.save();
    }
}

module.exports = async function createArticles(num) {
    await Article.deleteMany();
    await Comment.deleteMany();
    for (let i = 1; i <= num; i++) {
        await createArticle(i);
    }
}
