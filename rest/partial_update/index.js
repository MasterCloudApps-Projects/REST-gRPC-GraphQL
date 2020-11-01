/**
 * This example contains a store with a predefined item in it. To fetch it, run:

curl -v http://localhost:4000/products/10

 * To update it, you'll need to provide conditional headers and a patch:

curl -v --header "Content-Type: application/json" \
--header "If-Unmodified-Since: Sun, 25 Oct 2020 18:31:40 GMT" \
--request PATCH \
--data '{"op": "replace", "path": "/price", "value": 10}' \
http://localhost:4000/products/10
 
 * Now you can run `GET` again and only the price will have been updated.
 */

const app = require('express')();
const bodyParser = require('body-parser')
const applyOperation = require('fast-json-patch').applyOperation;

var productsStore = new Map();
productsStore.set('10', {
    'modificationTime': new Date(1603650700000),
    'value': {
        'name': 'Coffee mug',
        'price': 6
    }
});

app.use(bodyParser.json()) // for parsing application/json
app
    // Endpoint to partially update a resource in the collection `products`.
    .patch('/products/:id', (req, res) => {
        const patch = req.body;
        const code = req.params.id;
        const identifier = '/products/' + code;
        const requestCondition = req.get('If-Unmodified-Since');
        const previous = productsStore.get(code);
        if (!requestCondition) {
            res.sendStatus(403);
        } else {
            requestConditionDate = new Date(requestCondition);
            if (!previous || requestConditionDate.getTime() !== previous.modificationTime.getTime()) {
                // Invalid preconditions:
                res.sendStatus(412);
            } else {
                // Preconditions met. Resource updated:
                productsStore.set(code, {
                    'modificationTime': new Date(),
                    // The patch is applied here. We are applying a single change. We could accept an array
                    // of changes and apply them sequencially.
                    'value': applyOperation(previous.value, patch).newDocument
                });
                res.status(200)
                .location(identifier)
                .set('Content-Location', identifier)
                .format({
                    'application/json': () => res.json(productsStore.get(code).value)
                })
            }
        }
    })

    // Return 200 when found or 404 when not found:
    .get('/products/:id', (req, res) => productsStore.has(req.params.id) ?
        res.format({
            'application/json': () =>
                res.set('Last-Modified', productsStore.get(req.params.id).modificationTime.toUTCString())
                    .json(productsStore.get(req.params.id).value)
        }) :
        res.sendStatus(404)
    );

app.listen(4000, () => console.log('Running a REST server at http://localhost:4000/'));
