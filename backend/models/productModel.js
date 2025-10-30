const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String, //Value Type
            required: [true, "Please Enter product name"], //2nd Arg is Error Message
            trim: true, //It trims the space start and end
            maxLength: [100, "Product name cannot exceed 100 characters"] //we can this field for fix length of the name field
        },

        price: {
            type: Number,
            required: [true, "Please enter product price"],
            default: 0
            // We don't need to give require because of we gave default value
        },

        description: {
            type: String,
            required: [true, "Please enter product description"]
        },

        rating: {
            type: String,
            default: 0
        },
        images: [
            {
                image: {
                    type: String,
                    required: true
                }
            }
        ],

        category: {
            type: String,
            required: [true, "Enter category name"],
            enum: {
                values: [
                    'Electronics',
                    "Mobile Phones",
                    'Laptops',
                    "Accessories",
                    "Headphones",
                    "Food",
                    "Books",
                    "Clothes/Shoes",
                    "Beauty/Health",
                    "Sports",
                    "Outdoor",
                    "Home"
                ],
                message: "Please select correct category"

                //User can't give own category name that's why we specify the fixed category using 'enum' field 
            }
        },
        seller: {
            type: String,
            required: [true, "Please enter product seller"]
        },
        stock: {
            type: Number,
            required: [true, "Please enter product stock"],
            maxLength: [20, "Product stock cannot exceed 20"]
        },
        numOfReviews: {
            type: Number,
            default: 0
        },
        reviews: [
            {
                name: {
                    type: String,
                    required: true
                },
                rating: {
                    type: String,
                    required: true
                },
                comment: {
                    type: String,
                    required: true
                }
            }
        ],
        createdAt: {
            type: Date,
            default: Date.now()
        }
    }
)

let schema = mongoose.model('Product', productSchema) //Product is the model name db will automatically create in plural like "Products"

module.exports = schema