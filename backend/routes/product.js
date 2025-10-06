const express = require('express');
const { getProducts, newProduct, getSingleProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const router = express.Router();

router.route('/products').get(getProducts); //those functions (getProduct, newProduct....) come from ProductController.js
router.route('/product/new').post(newProduct);
router.route('/product/:id')
                            .delete(deleteProduct)
                            .get(getSingleProduct)
                            .put(updateProduct); // //:id means id in URl
module.exports = router 