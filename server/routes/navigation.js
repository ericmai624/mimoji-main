const router = require('express').Router();
const { navigation } = require('../controller/index');

router.get('/', navigation.readdir);

module.exports = router;