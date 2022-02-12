const User = require('./../model/userModel')
const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError')


const getAllUsers = catchAsync( async(req,res) => {
    const users = await User.find();

    //send response
    res.status(200).json({
        status: 'success',
        result: users.length,
        data: {
         users
        }
    })
})

const getUser = (req,res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route not define'
    })
}
const createUsers = (req,res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route not define'
    })
}
const updateUser = (req,res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route not define'
    })
}

const deleteUser = (req,res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route not define'
    })
}

module.exports = {
    getAllUsers,
    getUser,
    createUsers,
    updateUser,
    deleteUser
}