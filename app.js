const express = require("express")
const morgan = require('morgan')

const app =express()

app.use(express.json())
app.use(morgan('dev'))
app.use(express.static(`${__dirname}/public`))

const AppError = require('./utils/appError')
const globalErrorHandler = require('./controllers/errorController')
const tourRouter = require('./routes/tourRoute')
const userRouter = require('./routes/userRoute')

// app.use((req,res,next) => {
//     req.requestTime = new Date().toISOString();
//     //console.log(req.headers)

//     next()
// })

app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)

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