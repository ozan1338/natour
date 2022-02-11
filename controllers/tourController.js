const fs = require("fs")

const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`))

const checkId = (req,res,next,val) => {
    if(req.params.id * 1 > tours.length - 1){
        return res.status(404).json({
            status: "error",
            message: "id not found"
        })
    }

    next();
}

const getAllTours = (req,res)=>{
    res.status(200).json({
        status: 'success',
        result: tours.length,
        data: {
            tours
        }
    })
}

const createTour = (req,res)=>{
    const newId = tours[tours.length-1].id + 1;
    const newTour = Object.assign({id: newId}, req.body);

    tours.push(newTour)

    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        })
    })
}

const getTour = (req,res)=>{
    //add ? after params is tell its optional

    const id = req.params.id * 1
    const tour = tours.find(item => item.id === id)


    res.status(200).json({
        status: 'success',
        result: tour.length,
        data: {
            tour
        }
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
    checkId
}