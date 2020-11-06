var express = require('express');

var app = express();
app
    // Return a product from an opaque URI.
    .get('/:id([a-z0-9\-]+)', (req, res) => res.format({
        'text/plain': () => res.send(`Get a product with id ${req.params.id}`)
    }))

    // Return a product using the most commonly used URI convention.
    .get('/products/:id', (req, res) => res.format({
        'text/plain': () => res.send(`Get a product with id ${req.params.id}`)
    }));

app.listen(4000, () => console.log('Running a REST server at http://localhost:4000/'));
