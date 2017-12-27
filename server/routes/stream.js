const router = require('express').Router();
const { stream } = require('../controller');

router.get('/process', stream.createStreamProcess);

router.get('/video/:dir/:file', stream.serveFiles);

router.get('/subtitle', stream.loadSubtitle);

router.post('/terminate', stream.terminate);

module.exports = router;