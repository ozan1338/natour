const express = require("express")
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
const hpp = require('hpp')

const app =express()
// GLOBAL MIDDLEWARE
// Set Security HTTP headers
app.use(helmet())

//Dev loggin
app.use(morgan('dev'))

//LIMIT REQUEST from same API
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many request from this IP, please Try Again'
});
app.use('/api', limiter)

//Body Parser, reading data from body to req.body
app.use(express.json())

//Data sanitization against NoSql query Injection
app.use(mongoSanitize())

//Data sanitization again XSS 
app.use(xss())

//Prevent parameter pollution
app.use(hpp({
    whitelist: [
        'duration',
        'ratingQuantity',
        'ratingAverage',
        'maxGroupSize',
        'price',
        'difficulty'
    ]
}))

//Serving Static File
app.use(express.static(`${__dirname}/public`))

//Testing middleware
app.use((req,res,next) => {
    req.requestTime = new Date().toISOString();
    //console.log(req.headers)

    next()
})

const AppError = require('./utils/appError')
const globalErrorHandler = require('./controllers/errorController')
const tourRouter = require('./routes/tourRoute')
const userRouter = require('./routes/userRoute')
const reviewRouter = require('./routes/reviewRoute')


app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/reviews', reviewRouter)

app.all('*', (req,res,next)=>{
    // res.status(404).json({
    //     status: "Fail",
    //     message: `Can't find ${req.originalUrl} on the server`
    // })

    // const err = new Error(`Can't find ${req.originalUrl} on the server`)
    // err.status = 'fail';
    // err.statusCode = 404;
    next(new AppError(`Can't find ${req.originalUrl} on the server`, 404))
})


app.use(globalErrorHandler)

module.exports = app