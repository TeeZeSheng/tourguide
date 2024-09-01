const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const Meal = require('./../models/Meal');
const MealPlan = require('./../models/MealPlan')
const mongoose = require('mongoose')

exports.createMealPlan = catchAsync( async (req, res, next) => {
    const mealPlan = await MealPlan.create(req.body)

    res.status(201).json({
        status: "success",
        data: {
            mealPlan
        }
    });
})

exports.getMealPlan = catchAsync ( async (req, res, next) => {
    const mealPlan = await MealPlan.find().populate('meal');

    res.status(200).json({
        status: "success",
        data: {
            mealPlan
        }
    })
})

exports.saveMealPlan = catchAsync( async (req, res, next) => {
    const mealPlanId = req.body.mealPlan;
    console.log(mealPlanId)
    const user = req.user

    await User.findByIdAndUpdate(user._id, {
        $push: {mealPlan: mealPlanId}
    });

    res.status(200).json({
        status: 'success',
        message: 'Saved to meal plan library',
        data: {
            user
        }
    })

    

})

exports.getUserMealPlan = catchAsync( async (req, res, next) => {
    const user = await User.findById(req.user._id).populate('mealPlan');


    res.status(200).json({
        status: 'success',
        message: 'Saved to meal plan library',
        data: {
            mealPlan: user
        }
    })
})

exports.deleteMealPlan = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user._id)
    const mealPLanId = new mongoose.Types.ObjectId(req.params.id);
    const index = user.mealPlan.findIndex(id => id.equals(mealPLanId));
    console.log(index)
    user.mealPlan.splice(index, 1);
    
    await user.save({ validateBeforeSave: false });
    
    
    res.status(204).json({
        status: 'success',
        message: 'meal plan deleted',

    })
    
})

exports.getMyMealPlan = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.params.id).populate('mealPlan');
    const mealPlan = user.mealPlan

    res.status(200).json({
        status: 'success',
        data: {
            mealPlan
        }
    })


})

exports.getMealSpotlight = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.params.id)
    let meal;

    if (user.goal === 'Fatloss') {
        meal = await MealPlan.aggregate([
            {
                $match: {image: "Fatloss"}
            }
        ])
    }
    else if (user.level === 'Build Muscle') {
        meal = await MealPlan.aggregate([
            {
                $match: {image: "Bulk"}
            }
        ])
    }

    res.status(200).json({
        status: 'success',
        data: {
            meal
        }
    })
})