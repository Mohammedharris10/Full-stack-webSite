const app = require("./app"); // import main app file
const dotenv = require('dotenv'); // use dotenv for env variables
const path = require('path'); // import path module
const connectDatabase = require("./config/database"); // import database connection function

dotenv.config({ path: path.join(__dirname, "config/config.env") }); 
// load env variables from config.env file
// why: it help to keep secret keys safe and not show in code

connectDatabase(); 
// connect to database
// why: must connect before server start to use data

const server = app.listen(process.env.PORT, ()=>{ 
    console.log(`Server Listening to the port: ${process.env.PORT} in ${process.env.NODE_ENV}`)
    // start server and print port number and mode
})

process.on('unhandledRejection', (err)=>{ 
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to unhandled rejection error`)
    // handle any promise error that not catched
    server.close(()=>{ 
        process.exit(1);
    })
})

process.on('unCaughtException', (err)=>{ 
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to unCaughtException error`)
    server.close(()=>{ 
        process.exit(1);
    })
})
