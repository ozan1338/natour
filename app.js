const express = require("express")
const morgan = require('morgan')

const app =express()

app.use(express.json())
app.use(morgan('dev'))
app.use(express.static(`${__dirname}/public`))

const tourRouter = require('./routes/tourRoute')
const userRouter = require('./routes/userRoute')

app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)

module.exports = app