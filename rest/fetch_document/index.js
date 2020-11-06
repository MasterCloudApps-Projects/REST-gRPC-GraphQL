/**
 * To fetch a document run any of the following:

curl -v http://localhost:4000/33b27e35-8f1a-4e05-8c4a-e36a90cffd9b

curl -v http://localhost:4000/articles/12

 * The above request will return the article whose id is `12`: `Article 12`
 *
 */

const express = require('express');
const app = express();

app
    // Return an article from an opaque URI.
    .get('/:id([a-z0-9\-]+)', (req, res) => res.format({
        'text/plain': () => res.send(`Article ${req.params.id}`)
    }))

    // Return an article using the most commonly used URI convention.
    .get('/articles/:id', (req, res) => res.format({
        'text/plain': () => res.send(`Article ${req.params.id}`)
    }));

app.listen(4000, () => console.log('Running a REST server at http://localhost:4000/'));
