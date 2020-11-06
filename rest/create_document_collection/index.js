/**
 * To create a new entry, run:

curl -v -H "Content-Type: application/json" \
    -d '{ "title": "This is my first post", "description": "This is the beginning of a beautiful friendship"}' \
    http://localhost:4000/articles

 * The above request will return a Location header. To fetch the entry created above, run (updating the identifier):

curl -v --request GET http://localhost:4000/articles/5fa5694ce5f5657b361d7cfe

*/

const app = require('express')();
require('./mongoose.js');
const bodyParser = require('body-parser')
const models = require('./models/index.js');
const routes = require('./routes/index.js');

app.use(bodyParser.json()) // for parsing application/json
app.use((req, res, next) => {
    req.context = {models,};
    next();
});

app.use('/articles', routes.article);
app.listen(4000, () => console.log('Running a REST server at http://localhost:4000/'));
