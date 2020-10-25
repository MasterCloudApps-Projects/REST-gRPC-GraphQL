/**
 * This example contains a store with a predefined item in it. To fetch it, run:

curl -v http://localhost:4000/products/10

 * To update it, you'll need to provide conditional headers.
 *
 * This will get a 403 Forbidden, since the resource exists, but no precondition has been specified:

curl -v --header "Content-Type: application/json" \
--request PUT \
--data '{"name": "Coffe mug", "price": 5}' \
http://localhost:4000/products/10

 * This will get a 412 Precondition Failed, since the resource exists, but the date precondition has not been met:

curl -v --header "Content-Type: application/json" \
--header "If-Unmodified-Since: Sun, 24 Oct 2020 18:31:40 GMT" \
--request PUT \
--data '{"name": "Coffe mug", "price": 5}' \
http://localhost:4000/products/10

 * This will succesfully update the resource:

curl -v --header "Content-Type: application/json" \
--header "If-Unmodified-Since: Sun, 25 Oct 2020 18:31:40 GMT" \
--request PUT \
--data '{"name": "Coffe mug", "price": 5}' \
http://localhost:4000/products/10
 */

const app = require('express')();
const bodyParser = require('body-parser')

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
    // Endpoint to add a new resource to the store `products`.
    .put('/products/:id', (req, res) => {
        const product = req.body;
        const code = req.params.id;
        const identifier = '/products/' + code;
        const requestCondition = req.get('If-Unmodified-Since');
        const previous = productsStore.get(code);
        if (!requestCondition) {
            if (previous) {
                // The resource exists, but the request lacks of request conditions. Forbidden:
                res.sendStatus(403);
            } else {
                // New resource created:
                productsStore.set(code, {
                    'modificationTime': new Date(),
                    'value': product
                });
                res.status(201)
                res.location(identifier);
                res.set('Content-Location', identifier);
                res.format({
                    'application/json': () => res.json(productsStore.get(code).value)
                });
            }
        } else {
            requestConditionDate = new Date(requestCondition);
            if (!previous || requestConditionDate.getTime() !== previous.modificationTime.getTime()) {
                // Invalid preconditions:
                res.sendStatus(412);
            } else {
                // Preconditions met. Resource updated:
                productsStore.set(code, {
                    'modificationTime': new Date(),
                    'value': product
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

