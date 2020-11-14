const app = require('express')();
require('./mongoose.js');
const bodyParser = require('body-parser')
const routes = require('./routes/index.js');
const jwt = require('express-jwt');
const cors = require('cors');

app.use(bodyParser.json());
app.use(cors({origin: process.env.CORS_ALLOWED_DOMAIN}));
app.post('/login', require('./login'));
app.use('/articles', routes.article);
app.use('/distances', routes.distance);
app.use('/videos', routes.video);
app.use('/clients', jwt({ secret: process.env.ACCESS_TOKEN_SECRET, algorithms: ['HS256'] }), routes.client);
app.use(jwt({secret: process.env.ACCESS_TOKEN_SECRET, algorithms: ['HS256'], credentialsRequired: false}), require('./graphql/handler'));
app.listen(4000, () => console.log('Running a REST and GraphQL server at http://localhost:4000/'));
