const AppError = require('./../utils/appError')

const handleCastErrorDB = err => {
    const message =`Invalid ${err.path}: ${err.value}`
    console.log('handle Error ', message);
    return new AppError(message, 400)
}

const handleDuplicateFieldsDB = err => {
    //console.log(err.keyValue.name)
    const message = `Duplicate Field Value: ${err.keyValue.name}. Please use another value`;
    return new AppError(message, 400)
}

const handleValidationErrorDB = err => {
    const errors = Object.values(err.errors).map(item => item.message)
    const message = `invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400)
}

const sendErroDev = (err, res) => {
    //console.log(err)
    res.status(err.statusCode).json({
        status: err.status,
        err: err,
        message: err.message,
        stack: err.stack,
    })
}

const sendErrorProd = (err, res) => {
    // Operational error , trusted message
    if(err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        })
    }else {
        //Programming or other unknown error : dont leak error details

        //1. Log Error
        //console.error('ERROR ', err)

        //2 Send generic Error
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong'
        })
    }
}

module.exports = ((err, req, res, next) => {

    //err.stack is give you where the error happen
    //console.log(err.stack)
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error'

    if(process.env.NODE_ENV === 'dev'){
        sendErroDev(err, res)
    }else if(process.env.NODE_ENV === 'prod') {
        let error = {...err}
        //console.log(error)
        if(err.name === 'CastError') {
            error = handleCastErrorDB(error)
        }
        if(err.code === 11000) {
            //console.log(error.keyValue.name)
            error = handleDuplicateFieldsDB(error)
        }
        if(err.name === 'ValidationError'){
            //console.log(error)
            error = handleValidationErrorDB(error)
        }
        sendErrorProd(error, res)
    }

})

