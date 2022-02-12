const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt')

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
        minlength: 8,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your Password'],
        validate: {
            validator: function(item) {
                return item === this.password
            },
            message: "Password not same"
        }
    }
})

userSchema.pre('save', async function(next)  {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 10);

    this.passwordConfirm = undefined;
    next()
})

userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword)
}

const User = mongoose.model('User', userSchema)

module.exports = User;