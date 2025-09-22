const express = require('express');
const { getProducts, newProduct, getSingleProduct } = require('../controllers/productController');
const router = express.Router();

router.route('/products').get(getProducts); //those functions (getProduct, newProduct....) come from ProductController.js
router.route('/product/new').post(newProduct);
router.route('/product/:id').get(getSingleProduct); //:id means id of the data
module.exports = router