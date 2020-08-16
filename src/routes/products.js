var express = require('express');
var router = express.Router();
const productsController = require('../controller/productsController');


router.get('/detail/:id', productsController.detail);
router.get('/search',productsController.search)
router.get('/checkout',productsController.checkout)
router.post('/procesar_pago',productsController.processPay)
router.post('/webhook',productsController.webhook)


module.exports = router;
