const catchAsync = require('../utils/catchAsync');
const Meal = require('./../models/Meal');

exports.getMealPlan = catchAsync(async (req, res, next) => {
    const goal = req.user.goal;
    console.log(goal);
    const meal = await Meal.aggregate([
        {
            $match: {type: goal}
        },
        {
            $group: {
                _id: '$time',
                name: {$push: '$name'},
                calories: {$push: '$calories'}
            }
        }
    ])



    res.status(200).json({
        status: 'success',
        data: {meal},
    })
});

exports.getOneMeal = catchAsync(async( req, res, next) => {
    const meal = await Meal.findById(req.params.id);

    res.status(200).json({
        status: 'success',
        data: {
            meal
        }
    })
})

exports.createMealPlan = (req, res, next) => {

}

exports.calculateCalories = (req, res, next) => {

}

exports.deleteMealPlan = (req, res, next) => {

}

exports.editMealPlan = (req, res, next) => {

}

