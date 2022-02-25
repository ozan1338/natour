const User = require('./../model/userModel')
const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError')
const factory = require('./handlerFactory')

const filterObj = (obj, ...allowedFields) => {
    const newObj = {}
    Object.keys(obj).forEach(item => {
        if(allowedFields.includes(item)) newObj[item] = obj[item]
    })

    return newObj
}

const updateMe = catchAsync(async (req,res,next) => {
    //1. Create Error If User Post Password Data
    if (req.body.password || req.body.passwordConfirm) {
        return next(new AppError('This Route is not for password update.', 400))
    }

    //2. Filtered out unwanterd field
    const filteredBody = filterObj(req.body, 'name', 'email');

    //3. Updated User Document
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        status:'success',
        data: {
            user: updatedUser
        }
    })
})

const deleteMe = catchAsync( async(req,res,next) => {
    await User.findByIdAndUpdate(req.user.id, {active: false})

    res.status(204).json({
        status: 'success',
        data: null
    })
})

const createUsers = (req,res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route not define! Please use signup instead'
    })
}

const getAllUsers = factory.getAll(User);

const getUser = factory.getOne(User)

//Do not update password with this
const updateUser = factory.updateOne(User)

const deleteUser = factory.deleteOne(User)

module.exports = {
    getAllUsers,
    getUser,
    createUsers,
    updateUser,
    deleteUser,
    updateMe,
    deleteMe
}