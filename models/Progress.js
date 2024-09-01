const mongoose = require('mongoose');

const progressSchema = mongoose.Schema({
    workout: {
        type: mongoose.Schema.ObjectId,
        ref: 'Workout',
    },
    date: {
        type: Date,
        default: Date.now,
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
    }


})

const Progress = mongoose.model('Progress', progressSchema);

module.exports = Progress;