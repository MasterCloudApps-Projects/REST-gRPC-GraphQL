const app = require('express')();
require('./mongoose.js');
const bodyParser = require('body-parser')
const routes = require('./routes/index.js');

app.use(bodyParser.json()) // for parsing application/json
app.use('/articles', routes.article);
app.use('/distances', routes.distance);
app.use('/videos', routes.video);
app.use(require('./graphql/handler'));
app.listen(4000, () => console.log('Running a REST and GraphQL server at http://localhost:4000/'));
