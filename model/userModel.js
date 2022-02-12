const mongoose = require('mongoose');
const validator = require('validator')

const userSchema = new mongoose.Schema({
    name: {
        type:String,
        require: [true, 'Please Fill Your Name'],
    },
    email: {
        type:String,
        require: [true, 'Please Fill Your Email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid Email']
    },
    photo: String,
    password: {
        type: String,
        required: [true, 'Please Fill Password'],
        minlength: 8
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your Password']
    }
})

const User = mongoose.model('User', userSchema)

module.exports = User;