// const ErrorHandler = require("../utils/errorHandler");
const ErrorHandler = require("../utils/errorHandler");
const User = require("../models/userModel");
const catchAsyncError = require("./catchAsyncError");
const jwt = require('jsonwebtoken');


exports.isAuthenticatedUser = catchAsyncError(async (req, res, next) =>{
    const {token} = req.cookies; // get token from cookies

    if(!token){
        return next(new ErrorHandler('Login first to handle this',401));  // if no token, stop request
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)  // verify token with secret key
    req.user = await User.findById(decoded.id) // find user
    next();
})

exports.authorizeRoles = (...roles) =>{
    return (req, res, next) =>{
        if(!roles.includes(req.user.role)){
            return next(new ErrorHandler(`The role ${req.user.role} is not allowed`,401))
        }
        next();
    }
}