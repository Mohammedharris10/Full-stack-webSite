const express = require('express')
const {newOrder, getSingleOrder, myOrders, Orders, updateOrder, delteOrder} = require("../controllers/orderController")
const router = express.Router();
const {isAuthenticatedUser, authorizeRoles} = require('../middlewares/authenticate')

router.route("/order/new").post(isAuthenticatedUser, newOrder); 
router.route("/order/:id").get(isAuthenticatedUser, getSingleOrder)
router.route("/myorders").get(isAuthenticatedUser, myOrders)


//Admin USage
router.route("/orders").get(isAuthenticatedUser, authorizeRoles("admin"), Orders)
router.route("/order/:id").put(isAuthenticatedUser, authorizeRoles("admin"), updateOrder)
                        .delete(isAuthenticatedUser, authorizeRoles("admin"), delteOrder)
module.exports = router;