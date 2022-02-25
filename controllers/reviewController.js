const Review = require('./../model/reviewModel')
const factory = require('./handlerFactory')

const setTourUserIds = (req,res,next) => {
    //Nested Route
    if(!req.body.tour) req.body.tour = req.params.tourId
    if(!req.body.user) req.body.user = req.user.id
    next()
}

const getAllReviews = factory.getAll(Review)

const getReview = factory.getOne(Review)

const createReview = factory.createOne(Review)

const updateReview = factory.updateOne(Review)

const deleteReview = factory.deleteOne(Review)

module.exports = {
    getAllReviews,
    createReview,
    deleteReview,
    updateReview,
    setTourUserIds,
    getReview
}