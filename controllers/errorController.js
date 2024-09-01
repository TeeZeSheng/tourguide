const AppError = require("../utils/appError");

const handleCastErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new AppError(message, 400);
}

const handleDuplicateFieldsDB = err => {
    const message = "Duplicate values are not allowed";
    return new AppError(message, 400);
    
}

const handleValidationError = err => {
    const errors = Object.values(err.errors).map(el => el.message);

    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400); 
}

const handleJWTError = () => {
    return new AppError("Invalid token! Please log in again", 401);   
}

const handleExpiredToken = () => {
    return new AppError("Session Expired! Please log in again", 401);
}
const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
    })
}

const sendErrorProd = (err, res) => {
    console.log(err.isOperational);
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        })
    } else {
        res.status(500).json({
            status: 'fail',
            message: 'Something wrong has occured'
        })
    }
}

module.exports = (err, req, res, next) => {
    console.log(err.stack);
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    console.log(process.env.NODE_ENV);
    if (process.env.NODE_ENV === 'development') {
        
        sendErrorDev(err, res)
    }
    else if (process.env.NODE_ENV === "production") {
        console.log("in pro")
        let error = {...err};
        if(error.name === 'CastError') {
            error = handleCastErrorDB(error)
        }
        if(error.code === 11000) {
            error = handleDuplicateFieldsDB(error)
        }
        if(error.name === 'ValidationError') {
            error = handleValidationError(error)
        }
        if(error.name === 'JsonWebTokenError'){
            error = handleJWTError()
        }
        if(error.name == 'TokenExpiredError'){
            error = handleExpiredToken()
        }
        sendErrorProd(error, res)
    }

    
}