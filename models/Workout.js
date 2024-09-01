const mongoose = require('mongoose');

const workoutSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'name cannot be empty'],
    },
    difficulty:{ 
        type: String,
        required: [true, 'difficulty cannot be empty'],
        enum: {values: ['easy', 'medium', 'difficult'],
                message: 'Invalid value. (Must be easy, medium, difficult',
            },
    },
    exercise:[
        
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Exercise',
        }
          
    ],
    type: {
        type: String,
        enum: {
            values: ['free', 'paid', 'custom'],
            message: 'Invalid values'
        }
    },
    image: {
        type: String
    }
})

const Workout = mongoose.model('Workout', workoutSchema);

module.exports = Workout;
