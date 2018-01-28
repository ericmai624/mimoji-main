const router = require('express').Router();
const { subtitle } = require('../controller');

router.get('/:id', subtitle.serve);

module.exports = router;