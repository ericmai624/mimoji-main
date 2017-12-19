const router = require('express').Router();
const { cast } = require('../controller');

router.get('/stream', cast.stream);

router.get('/duration', cast.getDuration);

module.exports = router;