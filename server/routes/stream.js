const router = require('express').Router();
const { stream } = require('../controller');

router.get('/video/:id/:file', stream.serve);

router.get('/subtitle/:id', stream.loadSubtitle);

router.post('/subtitle', stream.addSubtitle);

module.exports = router;