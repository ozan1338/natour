const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const APIFeatures = require('./../utils/apiFeatures')

const deleteOne = Model => catchAsync(async(req,res,next)=>{
    const doc = await Model.findByIdAndDelete(req.params.id)

    if(!doc) {
        return next(new AppError('No document found with that ID', 404))
    }

    res.status(204).json({
        status: "success",
        data: null
    })
})

const updateOne = Model => catchAsync(async(req,res,next)=>{
    const doc =  await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    if(!doc) {
        return next(new AppError('No document found with that ID', 404))
    }

    res.status(200).json({
        status: "success",
        data: {
            doc
        }
    })
})

const createOne = Model => catchAsync(async(req,res,next)=>{
    const newData = await Model.create(req.body)
    
        res.status(201).json({
            status: 'success',
            data: {
                tour: newData
            }
        })
})

const getOne = (Model,populateOption) => catchAsync(async(req,res,next)=>{
    //add ? after params is tell its optional
    let query = Model.findById(req.params.id);

    if(populateOption) query = query.populate(populateOption)

    const doc = await query
    //Tour.findOne({ _id: req.params.id })

    if(!doc) {
        return next(new AppError('No doc found with that ID', 404))
    }

    res.status(200).json({
        status: 'success',
        data: {
            doc
        }
    })
})

const getAll = Model => catchAsync(async(req,res,next)=>{
    //to allow for nested get reviews on tour
    let filter = {}
    if (req.params.tourId) filter = {tour: req.params.tourId}

    const features = new APIFeatures(Model.find(filter), req.query).filter().sort().limitFields().paginate()
    const doc = await features.query

    //send response
    res.status(200).json({
        status: 'success',
        result: doc.length,
        data: {
            doc
        }
    })
})

module.exports = {
    deleteOne,
    updateOne,
    createOne,
    getOne,
    getAll
}
