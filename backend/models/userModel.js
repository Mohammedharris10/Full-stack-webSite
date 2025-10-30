const mongoose = require("mongoose");
const validator = require("validator")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, "Please enter the name"]
    },
    email:{
        type:String,
        required: [true, "Please enter email"],
        unique: true, //unique value that's why mentioned this
        validator: [validator.isEmail, "Please enter valid email"]
    },
    password: {
        type: String,
        required: [true, "Plaese enter password"],
        maxlength: [6, 'Password cannot exceed 6 characters']
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
    resetPasswordTokenExpire: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
})

userSchema.pre("save", async function (next){
    // before saving user, hash the password before (pre) a document is saved to the database.
    this.password = await bcrypt.hash(this.password, 10)
    // becasue of we never save plain password in database
})

userSchema.methods.getJwtToken = function(){
    return jwt.sign({id: this.id}, process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRES_TIME
    })
}

let model = mongoose.model('User',userSchema);

module.exports = model;