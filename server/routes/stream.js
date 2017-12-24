const router = require('express').Router();
const { stream } = require('../controller');

router.get('/video/:dir/:file', stream.stream);

router.get('/process', stream.createStreamProcess);

module.exports = router;