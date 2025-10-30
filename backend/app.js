const express = require('express')      // import express framwork
const app = express()                   // create app instace
const errorMiddleware = require("./middlewares/error") // import custom error handler
const cookieParser = require("cookie-parser")

app.use(express.json())                 // make app to read json data
app.use(cookieParser())
const products = require("./routes/product")  // import product route file
const auth = require("./routes/auth");


app.use('/api/v1/', products);          // use product routes with base url
app.use('/api/v1/', auth);
app.use(errorMiddleware)                // use error middleware at last

module.exports = app                   
