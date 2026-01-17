const mongoose = require("mongoose");        // mongodb connection library
const validator = require("validator");      // for email and data validation
const bcrypt = require("bcrypt");            // for hashing passwords
const jwt = require("jsonwebtoken");         // for creating jwt tokens
const crypto = require('crypto');          // for generating reset token
const ErrorHandler = require("../utils/errorHandler");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter the name"]
    },
    email: {
        type: String,
        required: [true, "Please enter email"],
        unique: true, //unique value that's why mentioned this
        validate: [validator.isEmail, "Please enter valid email"]
    },
    password: {
        type: String,
        required: [true, "Plaese enter password"],
        maxlength: [6, 'Password cannot exceed 6 characters']
        , select: false // // don't show password when fetching user data
    },
    avatar: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'user'
    },
    resetPasswordToken: String, //If field schema has one value like this we can write like this
    resetPasswordTokenExpire: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }
})

// purpose: secure user password by hashing it before saving to database
userSchema.pre("save", async function (next) {

    // if password not changed, skip hashing
    if (!this.isModified('password')) {
        next()
    }

    // hash password before save
    this.password = await bcrypt.hash(this.password, 10)

    // never store plain password
})

// generate jwt token for logged-in user
userSchema.methods.getJwtToken = function () {

    // create jwt token using user id
    return jwt.sign({ id: this.id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_TIME // token expire time
    })
}

// check entered password with stored hashed password
userSchema.methods.isValidPassword = async function (enterPassword) {

    // compare entered password with hashed password
    return bcrypt.compare(enterPassword, this.password)
}

// create reset password token for forgot password
userSchema.methods.getResetToken = function () {

    // generate random token
    const token = crypto.randomBytes(20).toString('hex');

    // hash token and store in database
    this.resetPasswordToken = crypto.createHash('sha256')
        .update(token)
        .digest('hex');

    // set token expiry time (30 minutes)
    this.resetPasswordTokenExpire = Date.now() + 30 * 60 * 1000;

    return token; // return original token to send via email
}

let model = mongoose.model('User', userSchema);

module.exports = model;