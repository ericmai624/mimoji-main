const router = require('express').Router();
const { navigation } = require('../controller/index');

router.get('/home', navigation.getHomeDir);

module.exports = router;