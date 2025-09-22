const products = require("../data/products.json");
//^ this file is a data file that's why import this
const Product = require("../models/productModel");
//^ We need model file for to seed the data into DB
const dotenv = require('dotenv');
//^ import the dotenv for access the environmental file
const connectDatabase = require("../config/database")
//^ we import the DB for connect the DB


dotenv.config({path: 'backend/config/config.env'});
//^ We connect this for access or connect the DB
connectDatabase(); //this Function from database.js file

const seedProducts = async ()=>{

    try{
        await Product.deleteMany();
        //^ we delete the data inside the DB before seed the Data
        console.log("Products Deleted");
        await Product.insertMany(products);
        //^ Insert the data form products.json using insertMany()
        console.log("All Products added!! ");

    }catch(error){
        console.log("ERROR",error.message);
    }
    //try and catch block we use for to identify the error
    process.exit(); //this method for to stop the process in terminal
}

seedProducts(); //We just the run "npm run seeder" in terminal for seed the data into DB