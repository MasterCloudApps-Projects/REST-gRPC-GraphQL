const { Router: Router } = require('express');

const router = Router();

router.post('/', (req, res) => {
    const News = req.context.models.news;
    let news = new News(req.body);
    news.save(function(err) {
        if (err) {
            res.status(500);
            res.json(err);
        } else {
            const identifier = '/news/' + news._id;
            res.location(identifier);
            res.status(201)
            res.set('Content-Location', identifier);
            res.format({
                'application/json': () => res.json({
                    title: news.title,
                    description: news.description
                })
            });
        }
    });
})

// Return 200 when found or 404 when not found:
router.get('/:id', (req, res) => {
    const News = req.context.models.news;
    News.findById(req.params.id, function(err, news) {
        if (err) {
            res.sendStatus(404);
        } else {
            res.format({
                'application/json': () => res.json({
                    title: news.title,
                    description: news.description
                })
            });
        }
    });
});

module.exports = router;
