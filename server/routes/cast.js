const router = require('express').Router();
const { cast } = require('../controller');

router.get('/:path', cast.castToTv);

module.exports = router;