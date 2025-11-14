const catchAsyncError = require("../middlewares/catchAsyncError");
const User = require("../models/userModel");
const sendEmail = require("../utils/email");
const ErrorHandler = require("../utils/errorHandler");
const sendToken = require("../utils/jwt")
const crypto = require('crypto')

//Creating User registation API -/api/v1/register
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


//Creating login API - /api/v1/login
exports.loginUser = catchAsyncError(async (req, res, next) => {

    const { email, password } = req.body; // get email & password

    if (!email || !password) {
        return next(new ErrorHandler("Please enter email & password", 400))
    }

    const user = await User.findOne({ email }).select('+password'); // find user and get password

    if (!user) {
        return next(new ErrorHandler("Invalid email or password", 401))
    }

    if (!await user.isValidPassword(password)) { // check password match or not
        return next(new ErrorHandler("Invalid email or password", 401))
    }

    sendToken(user, 201, res) // send jwt token if login success
})

//LogOut API - /api/v1/logout
exports.logoutUser = (req, res, next) => {
    res.cookie('token', null, { //clear token cookie
        expires: new Date(Date.now()), // expire now
        httpOnly: true
    })
    .status(200)
    .json({
        success: true,
        message: "Loggedout"
    })
}

//Forgot Password API - /api/v1/password/forgot
exports.forgotPassword = catchAsyncError( async(req, res, next)=>{
    const user = await User.findOne({email: req.body.email});

    //Check E-mail is there?

    if(!user){
        return next(new ErrorHandler('User not found with this',404))
    }

    const resetToken = user.getResetToken();

    await user.save({validateBeforeSave: false}) //we don't need to valiadate in this place

    //Create Rset url
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`

    const message = `Your password reset url is as follows \n\n
    ${resetUrl} \n\n If you have not requested this email, then ignore it`

    try{
        sendEmail({
            email: user.email,
            subject: `${user.email} Password Recovery`,
            message
        })

        res.status(200).json({
            success: true,
            message: `E-mail sent to ${user.email}`
        })

    }catch(error){
        user.resetPasswordToken = undefined;
        user.resetPasswordTokenExpire = undefined;
        await user.save({validateBeforeSave: false});
        return next(new ErrorHandler(error.message));
    }

})

exports.resetPassword = catchAsyncError(async(req, res, next) =>{
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token.trim()).digest('hex');

    // console.log(typeof req.params.token)

    const user = await User.findOne({ // find user by token and expire time
        resetPasswordToken,
        resetPasswordTokenExpire:{
            $gt : Date.now()
        }
    })

    if(!user){
        return next(new ErrorHandler("Password reset token is invalid"));
    }

    if (req.body.password !== req.body.confirmPassword){
        return next(new ErrorHandler("Password does not match"));
    }

    user.password = req.body.password; //Set new password
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpire = undefined;
    await user.save({validateBeforeSave: false})

    sendToken(user,201,res)
})