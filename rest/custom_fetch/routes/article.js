const router = require('express').Router();

router.get('/', require('./artiglesGet'));

router.post('/', require('./articlePost'));

/**
 * Accepts an id.
 * 
 * Arguments:
 * - Optional: fields. Default value: ['title', 'description']
 * - Accepts: 'title', 'description', 'createdAt', 'updatedAt', 'comments'
 * 
 * Errors:
 * - If there is no item for the given id, 404 is returned.
 * - If the given id is not properly formed, 400 is returned.
 * - If there is an error in the server, 500 is returned.
 */
router.get('/:id', require('./articleGet'));

module.exports = router;
