// export error middleware
module.exports = (err, req, res, next) => {

    err.statusCode = err.statusCode || 500  // if no status code, use 500

    // show full error details only in development
    if(process.env.NODE_ENV === "development"){   
        res.status(err.statusCode).json({
            success: false,
            message: err.message, 
            stack: err.stack, // show line of error
            err: err // send full error object
        })
    }

    // show clean message in production
    if(process.env.NODE_ENV === "production"){   
        
        let message = err.message;
        let error = new Error(message,400) // make new error object

        // handle mongoose validation error
        if(err.name == "ValidationError"){
            message = Object.values(err.errors).map(value => value.message)
            error  = new Error(message,400)
        }

        // handle wrong mongodb id error
        if(err.name == "CastError"){
            message = `Resource not found: ${err.path}`
            error  = new Error(message,400)
        }

        if(err.code == 11000){
            message = `Duplicate ${Object.keys(err.keyValue)} Errorr`
            error  = new Error(message)
        }

        if(err.name == "JSONWebTokenError"){
            message = `JSON web token is invalid. Try again`
            error  = new Error(message)
        }

        if(err.name == "TokenExpiredError"){
            message = `JSON web token is EXPIRED. Try again`
            error  = new Error(message)
        }

        res.status(err.statusCode).json({
            success: false,
            message: error.message || "Internal Server Error" // default message
        })
    }
}
