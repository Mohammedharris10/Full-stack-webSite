const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({

    shippingInfo: {
        address: { type: String, required: true },
        country: { type: String, required: true },
        city: { type: String, required: true },
        phoneNo: { type: String, required: true },
        postalCode: { type: String, required: true }
    },

    // store which user created this order (user id)
    // ObjectId help to link with other collection
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: "User"   // ref means it point to User collection
    },

    orderItems: [{
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },

        // link each order item to real product
        // so we can fetch product details anytime
        product: {
            type: mongoose.SchemaTypes.ObjectId,
            required: true,
            ref: "Product" // reference Product model
        }
    }],

    itemsPrice: { type: Number, required: true, default: 0.0 },
    taxPrice: { type: Number, required: true, default: 0.0 },
    shippingPrice: { type: Number, required: true, default: 0.0 },
    totalPrice: { type: Number, required: true, default: 0.0 },

    // when payment completed
    paidAt: { type: Date },

    // when order delivered
    deliveredAt: { type: Date },

    orderStatus: { type: String, required: true },

    createdAt: { type: Date, default: Date.now }
});

// this create the order collection model
let orderModel = mongoose.model("Order", orderSchema);

module.exports = orderModel;
