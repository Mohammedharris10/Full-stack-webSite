 const express = require('express');
 const app = express();
const products = require("./routes/product") //import the product route

app.use('/api/v1/', products)

 module.exports = app; //Export the app in this line
 