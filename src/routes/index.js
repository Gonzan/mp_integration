var express = require('express');
var router = express.Router();
const staticController = require('../controller/staticController') 
/* GET home page. */
router.get('/', staticController.index);

module.exports = router;
