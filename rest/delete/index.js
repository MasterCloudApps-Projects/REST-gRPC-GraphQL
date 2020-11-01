/**
 * To create a new entry, run:

curl -v --header "Content-Type: application/json" \
--header "Slug: first-product" \
-X POST \
--data '{"title": "This is my first product"}' \
http://localhost:4000/products

 * To fetch the entry created above, run:

curl -v -X GET http://localhost:4000/products/first-product
 
 * To get rid of it:

curl -v -X DELETE http://localhost:4000/products/first-product

*/

const app = require('express')();
const bodyParser = require('body-parser')
const { v4: uuidv4 } = require('uuid');

var productsCollection = new Map();

app.use(bodyParser.json()) // for parsing application/json
app
    // Factory method to add a new entry to the collection `products`.
    .post('/products', (req, res) => {
        const product = req.body;

        // The slug is optional. A random UUDI is generated when empty:
        const slug = req.get('slug') || uuidv4();
        productsCollection.set(slug, product);
        const identifier = '/products/' + slug;
        res.location(identifier);
        res.status(201)
        res.set('Content-Location', identifier);
        res.format({
            'application/json': () => res.json(productsCollection.get(slug))
        });
    })

    // Return 200 when found or 404 when not found:
    .get('/products/:id', (req, res) => productsCollection.has(req.params.id) ?
        res.format({
            'application/json': () => res.json(productsCollection.get(req.params.id))
        }) :
        res.sendStatus(404)
    )
    .delete('/products/:id', (req, res) => {
        if (productsCollection.has(req.params.id)) {
            productsCollection.delete(req.params.id);
            res.sendStatus(204);
        } else {
            res.sendStatus(404)}
        }
    );

app.listen(4000, () => console.log('Running a REST server at http://localhost:4000/'));
