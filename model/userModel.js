const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto')

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
    role: {
        type: String,
        enum: ['user', 'guide', 'lead-guide', 'admin'],
        default: 'user'
    },
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
    },
    passwordChangeAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: true,
        select: false
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

userSchema.methods.changePasswordAfter = function(JWTTimestamp) {
    if(this.passwordChangeAt) {
        const changedTimeStamp = parseInt(this.passwordChangeAt.getTime()/1000, 10)
        //console.log(changedTimeStamp, JWTTimestamp)
        return JWTTimestamp < changedTimeStamp
    }

    //False mean not change
    return false
}

userSchema.pre('save', function(next) {
    if(!this.isModified('password') || this.isNew) return next()

    this.passwordChangeAt = Date.now() - 1000;

    next();
})

userSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken =  crypto.createHash('sha256').update(resetToken).digest('hex');

    console.log({resetToken}, this.passwordResetToken)

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
}

userSchema.pre(/^find/, function (next) {
    //this point to the find query
    this.find({active: {$ne: false}});
    next()
});

const User = mongoose.model('User', userSchema)

module.exports = User;