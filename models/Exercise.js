const mongoose = require('mongoose');

const exerciseSchema = mongoose.Schema({
    name:{
        type: String,
        required: [true, 'name cannot be blank!'],
    },
    muscle: {
        type: [String],
        required: [true, 'muscle group cannot be blank!'],
    },
    type: {
        type: String,
    },
    equipment: {
        type: String,
    },
    difficulty: {
        type: String,
    },
    instructions: {
        type: String,
    },
    count: {
        type: String,
        required: [true, 'rep cannot be blank!'],
        enum: {
            values: ['seconds', 'reps'],
            message: 'Invalid value'
        }
    },
    number: {
        type: Number,
    },
    image: {
        type: String,
    }
})

const Exercise = mongoose.model('Exercise', exerciseSchema);

module.exports = Exercise;