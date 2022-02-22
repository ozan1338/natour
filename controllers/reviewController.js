const Review = require('./../model/reviewModel')
const APIFeatures = require('./../utils/apiFeatures')
const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError')

const getAllReviews = catchAsync(async (req,res,next) => {
    let filter = {}
    if (req.params.tourId) filter = {tour: req.params.tourId}

    const reviews = await Review.find(filter)

    res.status(200).json({
        status:"success",
        result: reviews.length,
        data: {
            reviews
        }
    })
})

const createReview = catchAsync(async (req,res,next) => {
    //Nested Route
    if(!req.body.tour) req.body.tour = req.params.tourId
    if(!req.body.user) req.body.user = req.user.id

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