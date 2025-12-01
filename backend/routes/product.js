const express = require('express');
const { getProducts, newProduct, getSingleProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const router = express.Router();
const {isAuthenticatedUser, authorizeRoles}= require('../middlewares/authenticate');
 
router.route('/products').get(isAuthenticatedUser,getProducts); //those functions (getProduct, newProduct....) come from ProductController.js
router.route('/product/:id')
                            .delete(deleteProduct)
                            .get(getSingleProduct)
                            .put(updateProduct); // //:id means id in URl


//Admin
router.route('/admin/product/new').post(isAuthenticatedUser,authorizeRoles('admin'),newProduct); //Check Login > Admin or user > access the newProduct
module.exports = router 