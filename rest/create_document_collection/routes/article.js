const { Router: Router } = require('express');
var mongoose = require('mongoose');
var { ValidationError, CastError } = mongoose.Error;

const router = Router();

router.post('/', async (req, res) => {
    const Article = req.context.models.article;
    let article = new Article(req.body);
    try {
        const newArticle = await article.save();
        const identifier = '/articles/' + newArticle._id;
        res.location(identifier);
        res.status(201);
        res.set('Content-Location', identifier);
        res.format({
            'application/json': () => res.json({
                title: article.title,
                description: article.description
            })
        });
    } catch (error) {
        if (error instanceof ValidationError) {
            res.sendStatus(400);
        } else {
            res.sendStatus(500);
        }
    }
});

// Return 200 when found or 404 when not found:
router.get('/:id', async (req, res) => {
    const Article = req.context.models.article;
    try {
        const articleFetched = await Article.findById(req.params.id);
        if (articleFetched) {
            res.format({
                'application/json': () => res.json({
                    title: articleFetched.title,
                    description: articleFetched.description
                })
            });
        } else {
            res.sendStatus(404);
        }
    } catch (error) {
        if (error instanceof CastError) {
            res.sendStatus(400);
        } else {
            res.sendStatus(500);
        }
    }
});

module.exports = router;
