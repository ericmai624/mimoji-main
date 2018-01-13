const router = require('express').Router();
const { stream } = require('../controller');

router.get('/video/:id/:file', stream.serve);

// router.post('/create', stream.create);

router.get('/subtitle/:id', stream.loadSubtitle);

router.post('/subtitle', stream.addSubtitle);

// router.post('/terminate', stream.cleanup);

module.exports = router;