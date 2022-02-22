const express = require("express");
const router = express.Router({ mergeParams: true });
const {protect,restrictTo} = require('./../controllers/authController')

const {getAllReviews,createReview} = require('./../controllers/reviewController')

// POST /tour/1221/reviews
// POST /reviews/

router.route('/').get(getAllReviews).post(protect, restrictTo('user') ,createReview);

module.exports = router
