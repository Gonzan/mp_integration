var express = require('express');
var router = express.Router();
const productsController = require('../controller/productsController');


router.get('/detail/:id', productsController.detail);
router.get('/search',productsController.search)
router.post('/webhook',productsController.webhook)
router.get('/payment/:status', productsController.payment)

module.exports = router;
