// 1. Create a custom error class (special type of error)
class ErrorHandler extends Error { 

    // 2. Constructor: gets message & status code when creating error
    constructor(message, statusCode) { 

        // 3. Pass message to built-in Error → important: keeps normal error features
        super(message) 

        // 4. Save the status code → important: lets you send HTTP status (404, 500)
        this.statusCode = statusCode; 

        // 5. Capture stack trace → important: helps see where error happened for debugging
        Error.captureStackTrace(this, this.constructor) 
    } 
} 

// 6. Export class → allows using it in other files
module.exports = ErrorHandler;
