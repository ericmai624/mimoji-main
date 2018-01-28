const router = require('express').Router();
const { stream } = require('../controller');

router.get('/video/:id/:file', stream.serve);

module.exports = router;