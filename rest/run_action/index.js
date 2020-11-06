/**
 * To run an action, execute:
 *
 * curl -v http://localhost:4000/distance/madrid/barcelona
 *
 * It will return a distance expressed in text/plain.
 *
 */

var express = require('express');

var app = express();
app
    // Return a distance from a certain resource (pair of cities).
    .get('/distance/:from/:to', (req, res) => res.format({
        'text/plain': () => res.send(`Distance from ${req.params.from} to ${req.params.to}: 540Km`)
    }));

app.listen(4000, () => console.log('Running a REST server at http://localhost:4000/'));
