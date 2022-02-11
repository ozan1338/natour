const Tour = require('./../model/tourModel')

// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`))

const getAllTours = (req,res)=>{
    res.status(200).json({
        status: 'success',
        // result: tours.length,
        // data: {
        //     tours
        // }
    })
}

const createTour = (req,res)=>{
    res.status(201).json({
        status: 'success',
        // data: {
        //     tour: newTour
        // }
    })
}

const getTour = (req,res)=>{
    //add ? after params is tell its optional

    const id = req.params.id * 1
    //const tour = tours.find(item => item.id === id)


    res.status(200).json({
        status: 'success',
        // result: tour.length,
        // data: {
        //     tour
        // }
    })
}

const updateTour = (req,res)=>{
    res.status(200).json({
        status: "success",
        data: "<Updated Tour.. >"
    })
}

const deleteTour = (req,res)=>{
    res.status(204).json({
        status: "success",
        data: null
    })
}

module.exports = {
    getAllTours,
    getTour,
    createTour,
    updateTour,
    deleteTour,
}