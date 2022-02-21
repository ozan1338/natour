const Review = require('./../model/reviewModel')
const APIFeatures = require('./../utils/apiFeatures')
const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError')

const getAllReviews = catchAsync(async (req,res,next) => {
    const reviews = await Review.find()

    res.status(200).json({
        status:"success",
        result: reviews.length,
        data: {
            reviews
        }
    })
})

const createReview = catchAsync(async (req,res,next) => {
    const newReview = await Review.create(req.body);

    res.status(201).json({
        status:"success",
        data: {
            newReview
        }
    })
})

module.exports = {
    getAllReviews,
    createReview
}