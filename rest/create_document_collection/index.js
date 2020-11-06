/**
 * To create a new entry, run:

curl -v --header "Content-Type: application/json" \
--request POST \
--data '{"title": "This is my first post", "description": "This is the beginning of a beautiful friendship"}' \
http://localhost:4000/news

 * The above request will return a Location header. To fetch the entry created above, run (updating the identifier):

curl -v --request GET http://localhost:4000/news/5fa5694ce5f5657b361d7cfe

*/

const app = require('express')();
require('./mongoose.js');
const models = require('./models/index.js');
const bodyParser = require('body-parser')
const routes = require('./routes/index.js');

app.use(bodyParser.json()) // for parsing application/json
app.use((req, res, next) => {
    req.context = {models,};
    next();
});

app.use('/news', routes.news);
app.listen(4000, () => console.log('Running a REST server at http://localhost:4000/'));
