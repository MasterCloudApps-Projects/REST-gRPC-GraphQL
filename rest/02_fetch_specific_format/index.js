/**
 * Method `res.format()` from express will run a Server-Driven Negotiation to choose the apropriate
 * representation based on the `Accept` param of the client.
 * 
 * To fetch a product in the default Media Type:

curl -v http://localhost:4000/products/12

 * In text/plain:

curl -v --header "Accept: text/plain" http://localhost:4000/products/12

 * In application/json:

curl -v --header "Accept: application/json" http://localhost:4000/products/12

 */

var express = require('express');

var app = express();
app
    // Return a product. Several formats are accepted
    .get('/products/:id', (req, res) => res.format({
        // Product in text description:
        'text/plain': () => res.send(`This is the text description of the product #${req.params.id}`),

        // Product in JSON:
        'application/json': () => res.json({
            'title': `Product #${req.params.id}`,
            'description': `Description of product #${req.params.id}`
        })
    }));

app.listen(4000, () => console.log('Running a REST server at http://localhost:4000/'));
