const express = require('express')      // import express framework
const app = express()                   // create express app
const errorMiddleware = require("./middlewares/error") // custom error handler
const cookieParser = require("cookie-parser") // to read cookies

app.use(express.json())                 // enable json body reading
app.use(cookieParser())                 // enable cookie reading

const products = require("./routes/product")  // product route file
const auth = require("./routes/auth")         // auth route file

app.use('/api/v1/', products)           // product APIs base url
app.use('/api/v1/', auth)               // auth APIs base url

app.use(errorMiddleware)                // use error middleware last

module.exports = app                    // export app
