/**
 * To create a new entry in the store, run:

curl -v --header "Content-Type: application/json" \
--request PUT \
--data '{"name": "Personal Computer", "price": 500}' \
http://localhost:4000/products/computer

 * To fetch the entry created above, run:

curl --request GET http://localhost:4000/products/computer

*/

const app = require('express')();
const bodyParser = require('body-parser')

var productsStore = new Map();

app.use(bodyParser.json()) // for parsing application/json
app
    // Endpoint to add a new resource to the store `products`.
    .put('/products/:id', (req, res) => {
        const product = req.body;
        const code = req.params.id;

        productsStore.set(code, product);
        const identifier = '/products/' + code;
        res.location(identifier);
        res.status(201)
        res.set('Content-Location', identifier);
        res.format({
            'application/json': () => res.json(productsStore.get(code))
        });
    })

    // Return 200 when found or 404 when not found:
    .get('/products/:id', (req, res) => productsStore.has(req.params.id) ?
        res.format({
            'application/json': () => res.json(productsStore.get(req.params.id))
        }) :
        res.sendStatus(404)
    );

app.listen(4000, () => console.log('Running a REST server at http://localhost:4000/'));

