const router = require('express').Router();
const { networkInterface } = require('../controller');

router.get('/', networkInterface.getIpAddress);

module.exports = router;