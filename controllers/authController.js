const User = require('./../model/userModel');
const catchAsync = require('./../utils/catchAsync')
const jwt = require('jsonwebtoken')
const AppError = require('./../utils/appError')
const sendEmail = require('./../utils/email')
const { promisify } = require('util');
const crypto = require('crypto');

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id)
    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true
    }

    if(process.env.NODE_ENV === 'prod') cookieOptions.secure = true
    res.cookie('jwt', token, cookieOptions)

    user.password = undefined

    res.status(statusCode).json({
        status:"success",
        token,
        data: {
            user
        }
    })
}

const signUp = catchAsync( async (req,res,next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        passwordChangeAt: req.body.passwordChangeAt,
        role: req.body.role
    })

    createSendToken(newUser, 201, res)    
})

const login = catchAsync( async (req,res,next) => {
    const {email, password} = req.body

    //1. Check if email and password exist
    if (!email || !password) {
        return next(new AppError('Please provide email and password!', 400))
    }

    //2. Check if user exist && password is correct
    const user = await User.findOne({email}).select('+password')
    

    if(!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401))
    }

    //3. If everything ok, send token to the client
    // const token = signToken(user._id)

    // res.status(200).json({
    //     status: "success",
    //     token
    // })
    createSendToken(user, 200, res) 
})

const protect = catchAsync( async (req,res,next) => {
    let token
    // 1. Get token and check if it's there
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
    }

    if(!token) {
        return next(new AppError('You are not logged in! Please Log in to get access', 401))
    }

    // 2. Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    //3. Check if user still exist
    const freshUser = await User.findById(decoded.id);
    if(!freshUser) {
        return next(new AppError('The Token is no longer Exist', 401))
    }

    //4. Check if user change password after the token was issued
    if(freshUser.changePasswordAfter(decoded.iat)) {
        return next(new AppError('User recently change password! Please login again', 401))
    };

    //Grant access to protected route
    req.user = freshUser;
    next();
})

const restrictTo = (...roles) => {
    return (req,res, next) => {
        //roles ['admin','lead-guide'], role='user'
        //console.log(roles)
        if(!roles.includes(req.user.role)) {
            return next(new AppError('You dont have permission to perform this action', 403))
        }

        next();
    }
}

const forgotPassword = catchAsync(async(req,res,next) => {
    //1. Get User based on Posted email
    const email = req.body.email || ''
    const user = await User.findOne({email: email})
    if(!user) {
        return next(new AppError(`There is no user with email: ${email}`, 404))
    }

    //2.Generate the random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false })

    //3.send it to user email
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/user/resetPassword/${resetToken}`

    const message = `Forgot your password ? Submit a Patch Request with your new password and 
                        psswordConfirm to: ${resetURL}.\nIf you didnt forget your password, please ignore
                        this email!`
    
    try{
        await sendEmail({
            email: email,
            subject: 'Your Password reset Token (valid for 10min)',
            message
        })
    
        res.status(200).json({
            status: 'success',
            message: 'Token Sent To Email'
        })

    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false })
        console.log(err)
        return next(new AppError('There was an error sending the email. Try Again Later'), 500)
    }
})

const resetPassword = catchAsync( async(req,res,next) => {
    //1. Get User based on the Token
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex')

    const user = await User.findOne({ 
        passwordResetToken: hashedToken, 
        passwordResetExpires: {$gt: Date.now()} 
    })

    //2. If token has not expired, and there is user, set the new password
    if(!user) {
        return next(new AppError('Token Invalid or has expired', 400))
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    //3. Update passwordChangeAt property for the user


    //4. Log the user in , send JWT
    // const token = signToken(user._id)

    // res.status(201).json({
    //     status:"success",
    //     token,
    //     data: {
    //         user
    //     }
    // })
    createSendToken(user, 200, res) 
})

const updatePassword = catchAsync( async (req,res,next) => {
    //1. Get user from collection
    const user = await User.findById(req.user.id).select('+password')

    //2.check if the post password correct
    if(!(await user.correctPassword(req.body.passwordCurrent,user.password))) {
        return next(new AppError('Incorrect Password', 400))
    }
    
    //3. If so, update the password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save()

    //4. Log user in, send JWT
    // const token = signToken(user._id)

    // res.status(201).json({
    //     status:"success",
    //     token,
    //     data: {
    //         user
    //     }
    // })
    createSendToken(user, 200, res) 
})

module.exports = {
    signUp,
    login,
    protect,
    restrictTo,
    forgotPassword,
    resetPassword,
    updatePassword
}