const router = require('express').Router();
const { cast } = require('../controller');

router.get('/video/:hash', cast.stream);

router.post('/update', cast.updateFilePath);

module.exports = router;