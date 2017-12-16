const router = require('express').Router();
const { cast } = require('../controller');

router.get('/stream', cast.stream);

module.exports = router;