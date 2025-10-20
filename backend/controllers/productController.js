const Product = require('../models/productModel')
const ErrorHandler = require("../utils/errorHandler")
const catchAsyncError = require("../middlewares/catchAsyncError")
const APIFeatures = require("../utils/apiFeatures")

// Get Products - /api/v1/products
exports.getProducts = catchAsyncError(async (req, res, next) => {

    const apiFeatures = new APIFeatures(Product.find(), req.query).search().filter();
    // use APIFeatures class to handle search and filter logic
    // find() return mongoose query object, not real data yet

    const products = await apiFeatures.query;
    // now execute the query and wait for actual product data

    res.status(200).json({
        success: true,
        count: products.length, // number of products found
        products // send all product data in response
    })
})

//Create Product - /api/v1/product/new
exports.newProduct = catchAsyncError(async (req, res, next) => {
    const product = await Product.create(req.body);
    res.status(201).json(
        {
            success: true,
            product // we use this instead of product:product
        }
    )
})

//Get Single Product - /api/v1/product/:id (get)
exports.getSingleProduct = async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    //^ findById function gives the value based on ID of the data

    //v Check data is empty or not
    if (!product) {
        return next(new ErrorHandler("Product not found", 400))
    }

    res.status(201).json({
        success: true,
        product
    })

}

//Update Product - /api/v1/product/:id (put)
exports.updateProduct = async (req, res, next) => {
    let product = await Product.findById(req.params.id);
    //^req.params.id means -“the value of the id parameter in the URL

    //It checks isempty or not
    if (!product) {
        return res.status(404).json({
            success: false,
            message: "Product not found"
        })
    }

    // Update product by ID
    product = await Product.findByIdAndUpdate(
        req.params.id,   // which product
        req.body,        // new data
        {
            new: true,          // return updated product
            runValidators: true // check schema rules
        }
    );

    res.status(200).json({
        success: true,
        product
    })
}

//Delete Product - /api/v1/product/:id
exports.deleteProduct = async(req, res, next) =>{
    const product = await Product.findById(req.params.id);
    
    if (!product) {
        return res.status(404).json({
            success: false,
            message: "Product Not Found"
        })
    }

    await product.deleteOne();
    //^.remove() no longer exists on the document, so it throws TypeError.
    //we used deleteOne()

    res.status(200).json({
        success: true,
        message: "Product Deleted"
    })
}