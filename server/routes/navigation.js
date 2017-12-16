const router = require('express').Router();
const { navigation } = require('../controller/index');

router.get('/', navigation.readDir);

module.exports = router;