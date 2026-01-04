const Product = require('../models/productModel')
const ErrorHandler = require("../utils/errorHandler")
const catchAsyncError = require("../middlewares/catchAsyncError")
const APIFeatures = require("../utils/apiFeatures")

// Get Products - /api/v1/products
exports.getProducts = catchAsyncError(async (req, res, next) => {
    const resPerPage = 3;
    const apiFeatures = new APIFeatures(Product.find(), req.query).search().filter().paginate(resPerPage);
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

    req.body.user = req.user.id
    const product = await Product.create(req.body);
    res.status(201).json(
        {
            success: true,
            product // we use this instead of 'product:product"
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
exports.deleteProduct = async (req, res, next) => {
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

//Create Review - api/v1/review
exports.createProductReview = catchAsyncError(async (req, res, next) => {
    // get rating, comment and product id from request
    const { rating, comment, productId } = req.body;

    // prepare review object with user id
    const review = {
        user: req.user.id,
        rating,
        comment
    };

    // find product using product id
    const product = await Product.findById(productId);

    // check user already reviewed this product or not
    const isReviewed = product.reviews.find(
        r => r.user.toString() == req.user.id.toString()
    );

    // if user already reviewed, update same review
    if (isReviewed) {
        product.reviews.forEach(review => {
            if (review.user.toString() == req.user.id.toString()) {
                review.comment = comment;
                review.rating = rating;
            }
        })
    }
    // if first time review, push new one
    else {
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }

    // calculate average rating from all reviews
    product.ratings =
        product.reviews.reduce((acc, item) =>
            {
                return acc + Number(item.rating)
            }, 0) / product.reviews.length;

    // console.log(product.ratings);

    // avoid NaN rating value
    product.rating = isNaN(product.ratings) ? 0 : product.ratings;
    // console.log(product.rating)

    // save product without validation again
    await product.save({ validateBeforeSave: false });
    res.status(200).json({
        success: true
    }); 
})

//Get Reviews - api/v1/reviews?id={product.id}
exports.getReviews = catchAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.query.id)

    res.status(200).json({
        success: true,
        revies: product.reviews
    })
})

//Delete Review - api/v1//review?id={product.id}&reviewId={review.id}
exports.deleteReview = catchAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.query.productId)

    let reviews = product.reviews.filter(reviews => {
        return reviews._id.toString() !== req.query.productId.toString()
    })

    const numOfReviews = reviews.length;
    let ratings = reviews.reduce((acc, i)=>{
        return acc + Number(i.rating)
    }) / reviews.length;

    reviews = isNaN(ratings) ? 0:ratings;
    await Product.findByIdAndUpdate(req.query.id,{
        reviews,
        ratings,
        numOfReviews
    })

    res.status(200).json({
        success: true
    })

})
