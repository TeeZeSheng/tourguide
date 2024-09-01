const mongoose = require('mongoose');

const mealSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'name cannot be blank!'],
    },
    type: {
        type: String,
        required: [true, 'meal type cannot be blank!'],
        enum: {
            values: ['fat-loss', 'bulk'],
            message: 'Invalid',
        },
    },
    description: {
        type: String,
        required: [true, 'description cannot be blank!'],
    },
    duration: {
        type: Number,
        required: [true, 'duration cannot be blank!'],
    },
    instruction: {
        type: String,
        required: [true, 'instruction cannot be blank!'],

    },
    time: {
        type: String,
        enum: {
            values: ['breakfast', 'lunch', 'dinner'],
            message: 'Invalid Value'
        }
    },
    ingredients: {
        type: [String],
        required: [true, 'Ingredients cannot be empty'],
    },
    calories: {
        type: Number,
        required: [true, 'Calories cannot be empty'],
    },
    image: {
        type: String,
    }
})

const Meal = mongoose.model('Meal', mealSchema);

module.exports = Meal;