const AppError = require('../utils/appError');
const {promisify} = require('util')
const catchAsync = require('../utils/catchAsync');
const Email = require('../utils/email');
const User = require('./../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto')

const signToken = id => {
    return jwt.sign({ id: id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES,
    });
}


exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        passwordChangedAt: req.body.passwordChangedAt,
        role: req.body.role,
        level: req.body.level,
        goal: req.body.goal,
    });
    // const url = 0;
    // await new Email(newUser, url).sendWelcome();

    const token = signToken(newUser._id)

    

    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: newUser
        }
    })
})

exports.signin = catchAsync( async (req, res, next) => {
    let email = req.body.email;
    let password = req.body.password;

    if (!email || !password ) {
        return next(new AppError("Please provide email and password", 400));
    }

    const user = await User.findOne({email}).select('+password');
    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError("Invalid Credentials", 401));
    }
    
    const token = signToken(user._id);
    res.status(200).json({
        status: "success",
        token,
        user: user
    })

})

exports.protect = catchAsync( async (req, res, next) => {
    let token;
    console.log(req.headers)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if(!token) {
        return next( new AppError("Please log in", 401));
    }

    //verify token
    //using promisify will retunr a promise
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    console.log(decoded)

    //check if user exists
    const freshUser = await User.findById(decoded.id);
    console.log(freshUser);

    if(!freshUser) {
        return next( new AppError( 'User does not exists', 401 ) );
    }

    //checks if user changed their password
    if (freshUser.changedPassword(decoded.iat)) {
        return next( new AppError( 'User password changed before', 401 ) );
    }
    

    req.user = freshUser;
    // req.token = token;
    next();
})

exports.getLoginDetails = (req, res, next) => {
    res.status(200).json({
        token: req.token,
        user: req.user,
        status: 'success'
    })
}


//this will return the middleware function
exports.restrictTo = ( ...roles ) => {
    return ( req, res, next ) => {
        if (!roles.includes(req.user.role)) {
            return next(new AppError('You do not have permission to perform this action', 403));
        }

        next();
    }
}

exports.forgetPassword = catchAsync(async (req, res, next) => {
    const user = await User.findOne( {email: req.body.email } );

    if (!user) {
        return next(new AppError("User not found", 404));
    }

    const resetToken = user.createResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;

    const message = `click here to reset your password ${resetURL}`;

    try{
        // await sendEmail({
        //     mail: user.email,
        //     subject: 'Your password reset token',
        //     message: message,
        // });

        await new Email(user, resetURL).sendPasswordReset();
    
        res.status(200).json({
            status: 'success',
            message: 'sent token'
        });
    }catch(err){
        user.passwordResetToken = undefined;
        user.passwordResetTokenExpired = undefined;
        await user.save({ validateBeforeSave: false });

        return next(new AppError("There was an error sending this email", 500));
    }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
    //get user based on token
    console.log(req.params.token);
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    console.log(hashedToken);

    //passwordResetTokenExpired: {$gt: Date.now()}

    const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetTokenExpired: {$gt: Date.now()} });
    console.log( Date.now() );
    console.log(user);

    //if token has not expired, set new password
    if (!user) {
        return next(new AppError('Token has expired', 400));
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpired = undefined;
    await user.save();

    //update changedPasswordAt

    //log the user in and send jwt
    const token = signToken(user.id);

    res.status(200).json({
        status: "success",
        message: "password updated successfully",
        token: token,
    })

})

exports.updatePassword = catchAsync(async (req, res, next) => {
    //get user from collection
    const user = User.findById(req.user.id);

    //check if password is correct
    if (!(await user.correctPassword(req.body.currentPassword, user.password))){
        return next(new AppError('Incorrect password! Please try again', 400));
    }
    //if correct, update the password
    user.password = req.body.newPassword;
    user.passwordConfirm = req.body.newPasswordConfirm;
    await user.save();

    const token = signToken(user.id);

    let cookieOptions = {
        expiresIn: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true,
    }

    if (process.env.NODE_ENV === 'production') {
        cookieOptions.secure = true;
    }

    res.cookie('jwt', token, cookieOptions)

    //send jwt back to user
    res.status(200).json({
        status: 'success',
        message: 'password successfully changed',
        token: token,
    })
})


