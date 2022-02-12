const Tour = require('./../model/tourModel')
const APIFeatures = require('./../utils/apiFeatures')

// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`))

const aliastTopTours = (req,res,next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingAverage,price';
    req.query.fields = 'name,price,ratingAverage,summary,difficulty';
    next();
}

const getAllTours = async(req,res)=>{
    try {

        const features = new APIFeatures(Tour.find(), req.query).filter().sort().limitFields().paginate()
        const tours = await features.query;
    
        //send response
        res.status(200).json({
            status: 'success',
            result: tours.length,
            data: {
                tours
            }
        })
        
    } catch (err) {
        console.log(err)
        res.status(400).json({
            status: 'Fail',
            message: err
        })
    }

}

const createTour = async(req,res)=>{
    try {
        // const newTour = new Tour({})
        // newTour.save()
    
        const newTour = await Tour.create(req.body)
    
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        })
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }

}

const getTour = async(req,res)=>{
    try {
        //add ? after params is tell its optional

        const tour = await Tour.findById(req.params.id)
        //Tour.findOne({ _id: req.params.id })

        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        })
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        })
    }
}

const updateTour = async(req,res)=>{
    try {
        const tour =  await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })

        res.status(200).json({
            status: "success",
            data: {
                tour
            }
        })
        
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }
}

const deleteTour = async(req,res)=>{
    try {

        await Tour.findByIdAndDelete(req.params.id)

        res.status(204).json({
            status: "success",
            data: null
        })
        
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }

}

module.exports = {
    getAllTours,
    getTour,
    createTour,
    updateTour,
    deleteTour,
    aliastTopTours
}