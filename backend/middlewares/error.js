// export error middleware
module.exports = (err, req, res, next) => {

    err.statusCode = err.statusCode || 500   // default 500 if no code

    if(process.env.NODE_ENV === "development"){   // dev mode
        res.status(err.statusCode).json({
            success: false,     
            message: err.message, 
            stack: err.stack,
            err: err   
        })
    }

    if(process.env.NODE_ENV === "production"){   // prod mode
        
        let message = err.message;
        let error = new Error(message,400)


        if(err.name == "ValidationError"){
            message = Object.values(err.errors).map(value => value.message)
            error  = new Error(message,400)
        }

        if(err.name == "CastError"){
            message = `Resource not found: ${err.path}`
            error  = new Error(message,400)
        }
        res.status(err.statusCode).json({
            success: false,     
            message: error.message || "Internal Server Error" //this is default error msg
        })
    }
}

