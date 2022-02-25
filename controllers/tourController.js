const Tour = require('./../model/tourModel')
const catchAsync = require('./../utils/catchAsync')
const factory = require('./handlerFactory')
const AppError = require('./../utils/appError')

// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`))

const aliastTopTours = (req,res,next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingAverage,price';
    req.query.fields = 'name,price,ratingAverage,summary,difficulty';
    next();
}

// const getAllTours = catchAsync(async(req,res,next)=>{
//     const features = new APIFeatures(Tour.find(), req.query).filter().sort().limitFields().paginate()
//     const tours = await features.query;

//     //send response
//     res.status(200).json({
//         status: 'success',
//         result: tours.length,
//         data: {
//             tours
//         }
//     })
// })

const getAllTours = factory.getAll(Tour)

const getTour = factory.getOne(Tour, { path: 'reviews' })

const createTour = factory.createOne(Tour)

const updateTour = factory.updateOne(Tour)

const deleteTour = factory.deleteOne(Tour)

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

//34.07250417214612,-118.3259384429614
const getTourWithin = catchAsync(async (req,res,next) => {
    const {distance, latlng, unit} = req.params;
    const [lat, lng] = latlng.split(',')

    const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

    if(!lat || !lng) {
        next(new AppError('Please Provide latitude and longitude in the format lat,lng', 400))
    }

    const tours = await Tour.find({ 
        startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } } 
    })

    res.status(200).send({
        status: 'success',
        result: tours.length,
        data: {
            tours
        }
    })
})

const getDistances = catchAsync(async (req,res,next) => {
    const {latlng, unit} = req.params;
    const [lat, lng] = latlng.split(',')

    const multiplier = unit === 'mi' ? 0.000621371 : 0.001

    if(!lat || !lng) {
        next(new AppError('Please Provide latitude and longitude in the format lat,lng', 400))
    }

    const distances = await Tour.aggregate([
        {
            $geoNear: {
                near: {
                    type: 'Point',
                    coordinates: [lng * 1, lat * 1]
                },
                distanceField: 'distance',
                distanceMultiplier: multiplier
            }
        },
        {
            $project: {
                distance: 1,
                name: 1
            }
        }
    ])

    console.log('ciao')

    res.status(200).send({
        status: 'success',
        data: {
            data: distances
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
    getMonthlyPlan,
    getTourWithin,
    getDistances
}