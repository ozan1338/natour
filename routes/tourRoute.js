const express = require("express")
const router = express.Router()

const {getAllTours,createTour,getTour,updateTour,deleteTour} = require("./../controllers/tourController")

// router.param("id", checkId)

const checkBody = (req,res,next) => {
    if(!req.body.name || !req.body.price){
        return res.status(400).send({
            status: "fail"
        })
    }

    next()
}

router.route('/').get(getAllTours).post(checkBody, createTour)
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour)

module.exports = router