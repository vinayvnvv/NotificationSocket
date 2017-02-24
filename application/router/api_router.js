var express = require('express');
var router = express.Router();

var broker = require('./../broker/main');
var admin  = require('./../admin/main');

router.use('/broker', broker);
router.use('/admin', admin);



module.exports = router;
