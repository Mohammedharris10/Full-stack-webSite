
const Order = require('../models/orderModel')
const catchAsyncError = require("../middlewares/catchAsyncError")
const ErrorHandler = require('../utils/errorHandler')
const Product = require('../models/productModel')


//Create New Order - api/v1/order/new
exports.newOrder = catchAsyncError(async(req, res, next) => {
    const {
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo
    } = req.body

    const order = await Order.create({
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo,
        paidAt: Date.now(),
        user: req.user.id
    })

    res.status(200).json({
        success: true,
        order
    })
})


//Get Single Order - api/v1/order/:id
exports.getSingleOrder = catchAsyncError(async (req, res, next) => {

    // populate use: it fetch linked user data from User model (like join in sql)
    const order = await Order.findById(req.params.id).populate('user', 'name email')

    // if no order found
    if (!order) {
        return next(new ErrorHandler(`Order not found with this id: ${req.params.id}`))
    }

    // send final response
    res.status(200).json({
        success: true,
        order
    })
})

//Get All Orders - api/v1/myorders
exports.myOrders = catchAsyncError(async (req, res, next)=>{
    const orders = await Order.find({user:req.user.id})

    res.status(200).json({
        success: true,
        orders
    })
})


//Admin: get All user orders - api/v1/orders
exports.Orders = catchAsyncError(async (req, res, next)=>{
    const orders = await Order.find()

    let totalOrder = 0;
    let totalAmount = 0

    orders.forEach(order =>{
        totalOrder += 1
        totalAmount += order.totalPrice
    })

    res.status(200).json({
        success: true,
        totalOrder,
        totalAmount,
        orders
    })
})

//Admin: Update the Orders - api/v1/orders/:id
exports.updateOrder = catchAsyncError(async(req, res, next)=>{
    const order = await Order.findById(req.params.id)

    if(order.orderStatus == "Delivered"){
        return next(new ErrorHandler('Order has been Already DELIVERED', 401))

    }

    //Updateing the Product stock of each order item
    order.orderItems.forEach(async orderItem =>{
        await updateStock(orderItem.product, orderItem.quantity)
        
    })

    console.log(order.orderStatus)
    order.orderStatus = req.body.orderStatus;
    order.deliveredAt = Date.now()
    await order.save();

    res.status(200).json({
        success: true,
        order
    })
})

async function updateStock (productId, quantity){
    const product = await Product.findById(productId);
    product.stock = product.stock - quantity
    product.save({validateBeforeSave: false})
}


//Admin: Delte the order - api/v1/order/:id
exports.delteOrder = catchAsyncError(async(req, res, next)=>{
    const order = await Order.findById(req.params.id)
    if(!order){
        return next(new ErrorHandler(`Order not found with this id: ${req.params.id}`, 401))
    }

    await order.deleteOne();
    res.status(200).json({
        success: true
    })
})