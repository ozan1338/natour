const Tour = require('./../model/tourModel')
const APIFeatures = require('./../utils/apiFeatures')
const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError')

// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`))

const aliastTopTours = (req,res,next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingAverage,price';
    req.query.fields = 'name,price,ratingAverage,summary,difficulty';
    next();
}

const getAllTours = catchAsync(async(req,res,next)=>{
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
})

const createTour = catchAsync(async(req,res,next)=>{
    const newTour = await Tour.create(req.body)
    
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        })
}) 

const getTour = catchAsync(async(req,res,next)=>{
    //add ? after params is tell its optional

    const tour = await Tour.findById(req.params.id).populate('reviews')
    //Tour.findOne({ _id: req.params.id })

    if(!tour) {
        return next(new AppError('No tour found with that ID', 404))
    }

    res.status(200).json({
        status: 'success',
        data: {
            tour
        }
    })
})

const updateTour = catchAsync(async(req,res,next)=>{
    const tour =  await Tour.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    if(!tour) {
        return next(new AppError('No tour found with that ID', 404))
    }

    res.status(200).json({
        status: "success",
        data: {
            tour
        }
    })
})

const deleteTour = catchAsync(async(req,res,next)=>{
    const tour = await Tour.findByIdAndDelete(req.params.id)

    if(!tour) {
        return next(new AppError('No tour found with that ID', 404))
    }

    res.status(204).json({
        status: "success",
        data: null
    })
})

const getTourStats = catchAsync(async(req,res,next) => {
    const stats = await Tour.aggregate([
        {
            $match: { ratingAverage: { $gte: 4.5 } }
        },
        {
            $group: {
                //_id: '$difficulty',
                _id: { $toUpper: '$difficulty'},
                numTour: { $sum: 1 },
                numRatings: { $sum: '$ratingQuantity' },
                avgRating: { $avg: '$ratingAverage'},
                avgPrice: { $avg: '$price' },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' }
            },
        },
        {
            $sort: { avgPrice: 1 }
        },
        // {
        //     $match: { _id: { $ne: "EASY" } }
        // }
    ])

    res.status(200).json({
        status: "success",
        data: {
            stats
        }
    })
    
})

const getMonthlyPlan = catchAsync(async(req,res,next) => {
    const year = req.params.year * 1; //2021

    const plan = await Tour.aggregate([
        {
            $unwind: '$startDates'
        },
        {
            $match: {
                startDates: {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`)
                }
            }
        },
        {
            $group: {
                _id: { $month: '$startDates' },
                numTourStarts: { $sum:1 },
                tours: { $push: '$name' }
            }
        },
        {
            $addFields: { month: '$_id' }
        },{
            $project: {
                _id: 0
            }
        },{
            $sort: { numTourStarts: -1 }
        },{
            $limit: 12
        }
    ])

    res.status(200).json({
        status: "success",
        data: {
            plan
        }
    })
})

module.exports = {
    getAllTours,
    getTour,
    createTour,
    updateTour,
    deleteTour,
    aliastTopTours,
    getTourStats,
    getMonthlyPlan
}