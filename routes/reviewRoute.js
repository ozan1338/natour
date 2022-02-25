const express = require("express");
const router = express.Router({ mergeParams: true });
const { protect, restrictTo } = require("./../controllers/authController");

const {
  getAllReviews,
  createReview,
  deleteReview,
  updateReview,
  setTourUserIds,
  getReview
} = require("./../controllers/reviewController");

// POST /tour/1221/reviews
// POST /reviews/

router
  .route("/")
  .get(getAllReviews)
  .post(protect, restrictTo("user"), setTourUserIds , createReview);
router
  .route("/:id")
  .delete(protect, restrictTo("admin", "lead-guide"), deleteReview)
  .patch(updateReview)
  .get(getReview);

module.exports = router;
