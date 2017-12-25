const router = require('express').Router();
const { stream } = require('../controller');

router.get('/video/:dir/:file', stream.serveFiles);

router.get('/process', stream.createStreamProcess);

router.post('/terminate', stream.terminate);

module.exports = router;