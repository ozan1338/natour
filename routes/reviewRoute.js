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

router.use(protect)

router
  .route("/")
  .get(getAllReviews)
  .post(restrictTo("user"), setTourUserIds , createReview);

  router
  .route("/:id")
  .get(getReview)
  .delete(restrictTo("admin", "user"), deleteReview)
  .patch(restrictTo("admin", "user"), updateReview)

module.exports = router;
