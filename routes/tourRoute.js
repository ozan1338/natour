const express = require("express");
const router = express.Router();

const {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  aliastTopTours,
  getTourStats,
  getMonthlyPlan
} = require("./../controllers/tourController");

const {protect, restrictTo} = require('./../controllers/authController')

// router.param("id", checkId)

// const checkBody = (req,res,next) => {
//     if(!req.body.name || !req.body.price){
//         return res.status(400).send({
//             status: "fail"
//         })
//     }

//     next()
// }

router.route("/top-5-cheap").get(aliastTopTours, getAllTours);
router.route("/tour-stats").get(getTourStats);
router.route("/monthly-plan/:year").get(getMonthlyPlan);
router.route("/").get(protect, getAllTours).post(createTour);
router.route("/:id").get(getTour).patch(updateTour).delete(protect, restrictTo('admin', 'lead-guide') ,deleteTour);

module.exports = router;
