const User = require("../models/User");
const Workout = require("../models/Workout");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const APIFeatures = require('./../utils/apiFeatures')
const mongoose = require('mongoose');


exports.getWorkout = catchAsync(async (req, res, next) => {
    const features = new APIFeatures(Workout.find(), req.query).filter().sort().limitFields().paginate();
    const workout = await features.query.populate();
    
    res.status(200).json({
        status: 'success',
        results: workout.length,
        data: {
            workout
        }
    })
});

exports.getOneWorkout = catchAsync( async (req, res, next) => {
    const workout = await Workout.findById(req.params.workoutId).populate('exercise')

    res.status(200).json({
        status: "success",
        data: {
            workout
        }
    })
})

exports.createWorkout = catchAsync(async (req, res, next) => {
    const workout = await Workout.create(req.body);

    res.status(201).json({
        status: "success",
        data: {
            workout
        }
    });
})

exports.saveWorkout = catchAsync(async (req, res, next) => {
    const user = req.user;

    console.log(user.workout.length);
    if (user.role === 'user' && user.workout.length >= 3) {
        return next(new AppError("Subscribe to save more workouts", 400));
    }

    await User.findByIdAndUpdate(user._id, {
        $push: {workout: req.params.workoutId}
    });

    res.status(200).json({
        status: 'success',
        message: 'Saved to workout library',
    })
})

exports.viewWorkout = catchAsync( async (req, res, next) => {
    const user = req.user;

    const workout = user.workout;

    res.status(200).json({
        status: 'success',
        result: workout.length,
        data: {workout}
    })
})

exports.deleteWorkout = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user._id)
    const workoutId = new mongoose.Types.ObjectId(req.params.id);
    const index = user.workout.findIndex(id => id.equals(workoutId));
    console.log(index)
    user.workout.splice(index, 1);
    
    await user.save({ validateBeforeSave: false });
    
    
    res.status(204).json({
        status: 'success',
        message: 'workout deleted',

    })
    
})

exports.getCustomWorkout = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user._id);
    const workout = user.customWorkout;

    res.status(200).json({
        status: 'success',
        data: {
            workout
        }
    })

})

exports.saveCustomWorkout = catchAsync(async (req, res, next) => {
    
})

exports.getWorkoutSpotlight = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.params.id)
    let workout;

    if (user.level === 'Beginner') {
        workout = await Workout.aggregate([
            {
                $match: {difficulty: "easy"}
            }
        ])
    }
    else if (user.level === 'Intermediate') {
        workout = await Workout.aggregate([
            {
                $match: {difficulty: "medium"}
            }
        ])
    }else {
        workout = await Workout.aggregate([
            {
                $match: {difficulty: "hard"}
            }
        ])
    }

    res.status(200).json({
        status: 'success',
        data: {
            workout
        }
    })

})



