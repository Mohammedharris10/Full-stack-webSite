const Product = require('../models/productModel')


// Get Products - /api/v1/products
exports.getProducts = async (req, res, next) =>{
    const products = await Product.find();
    // ^ find() function return data
    res.status(200).json(
        {
            success: true,
            count: products.length, //It returns the count of the data
            products
        }
    )
}

//Create Product - /api/v1/product/new
exports.newProduct = async(req, res, next)=>{
    const product = await Product.create(req.body);
    res.status(201).json(
        {
            success: true,
            product // we use this instead of product:product
        }
    )
}

//Get Single Product -
exports.getSingleProduct = async(req,res,next) =>{
    const product = await Product.findById(req.params.id);
    //^ findById function gives the value based on ID of the data
    
    //v Check data is empty or not
    if(!product)
    {
        return res.status(404).json({
            success: false,
            message: "Product Not Found"
        })
    }

    res.status(201).json({
        success: true,
        product
    })

}