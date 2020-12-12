const router = require('express').Router();

router.get('/:from/:to', require('./distanceGet'));

module.exports = router;
