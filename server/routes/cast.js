const router = require('express').Router();
const { cast } = require('../controller');

router.get('/stream', cast.stream);

router.get('/metadata', cast.getMetadata);

module.exports = router;