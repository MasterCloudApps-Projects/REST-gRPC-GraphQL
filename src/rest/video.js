const router = require('express').Router();

router.post('/tasks', require('./videoTaskPost'));

router.get('/tasks/:id', require('./videoTaskGet'));

router.get('/:id', require('./videoGet'));

module.exports = router;
