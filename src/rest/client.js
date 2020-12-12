const router = require('express').Router();

router.get('/:dni', require('./clientGet'));

module.exports = router;
