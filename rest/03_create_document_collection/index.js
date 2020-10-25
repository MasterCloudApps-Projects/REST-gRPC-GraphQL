/**
 * To create a new entry, run:

curl -v --header "Content-Type: application/json" \
--header "Slug: first-post" \
--request POST \
--data '{"title": "This is my first post", "description": "This is the beginning of a beautiful friendship"}' \
http://localhost:4000/news

 * To fetch the entry created above, run:

curl --request GET http://localhost:4000/news/first-post

*/

const app = require('express')();
const bodyParser = require('body-parser')
const { v4: uuidv4 } = require('uuid');

var newsMap = new Map();

app.use(bodyParser.json()) // for parsing application/json
app
    // Factory method to add a new entry to the collection `news`.
    .post('/news', (req, res) => {
        const news = req.body;

        // The slug is optional. A random UUDI is generated when empty:
        const slug = req.get('slug') || uuidv4();
        newsMap.set(slug, news);
        const identifier = '/news/' + slug;
        res.location(identifier);
        res.status(201)
        res.set('Content-Location', identifier);
        res.format({
            'application/json': () => res.json(newsMap.get(slug))
        });
    })

    // Return 200 when found or 404 when not found:
    .get('/news/:id', (req, res) => newsMap.has(req.params.id) ?
        res.format({
            'application/json': () => res.json(newsMap.get(req.params.id))
        }) :
        res.sendStatus(404)
    );

app.listen(4000, () => console.log('Running a REST server at http://localhost:4000/'));

