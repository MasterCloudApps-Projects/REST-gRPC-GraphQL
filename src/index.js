const http = require('http');
const app = require('express')();
const httpServer = http.createServer(app);
require('./mongoose.js');
const bodyParser = require('body-parser')
const routes = require('./routes/index.js');
const jwt = require('express-jwt');
const cors = require('cors');

app.use(bodyParser.json());
app.use(jwt({ secret: process.env.ACCESS_TOKEN_SECRET, algorithms: ['HS256'], credentialsRequired: false }));
app.use(cors({origin: process.env.CORS_ALLOWED_DOMAIN}));
app.post('/login', require('./login'));
app.use('/articles', routes.article);
app.use('/distances', routes.distance);
app.use('/videos', routes.video);
app.use('/clients', routes.client);
require('./graphql/graphql')(app, httpServer);

const PORT = 4000;

httpServer.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}`)
    console.log(`🚀 Subscriptions ready at ws://localhost:${PORT}`)
});
