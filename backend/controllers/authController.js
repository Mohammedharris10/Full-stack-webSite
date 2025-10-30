const catchAsyncError = require("../middlewares/catchAsyncError");
const User = require("../models/userModel");
const ErrorHandler = require("../middlewares/error");
const sendToken = require("../utils/jwt")

//Creating User registation API -
exports.registerUser = catchAsyncError(async (req, res, next) => {
    const { name, email, password, avatar } = req.body;
    await User.deleteMany({});
    const user = await User.create({
        name,
        email,
        password,
        avatar
    })

    sendToken(user, 201, res)
})


//Creating login API - 
exports.loginUser = catchAsyncError(async (req, res, next) => {

    const { email, password } = req.body; // get email & password

    if (!email || !password) {
        return next(new ErrorHandler("Please enter email & password", 400))
    }

    const user = await User.findOne({ email }).select('+password'); // find user and get password

    if (!user) {
        return next(new ErrorHandler("Invalid email or password", 400))
    }

    if (!(await user.isValidPassword(password))) { // check password match or not
        return next(new ErrorHandler("Invalid email or password", 400))
    }

    sendToken(user, 201, res) // send jwt token if login success
})