const mongoose = require("mongoose");
const Tour = require("./Tour");

const reviewSchema = mongoose.Schema({
    review: {
        type: String,
        required: [true, 'Review cannot be empty'],

    },
    rating: {
        type: Number,
        default: 5,
        min: 1,
        max: 5,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        required: [true, 'Review must belong to a tour'],
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Review must have an owner'],
    },

},
{
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
})

reviewSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'user',
        select: 'name',
    });


    next();
})

reviewSchema.statics.calculateAverage = async function(tourId) {
    const stats = await this.aggregate([
        {
            $match: {tour: tourId}
        },
        {
            $group: {
                _id: '$tour',
                nRating: { $sum: 1},
                avgRating: { $avg: '$rating' }
            }
        }
    ])

    if(stats){
        await Tour.findByIdAndUpdate(tourId, {
            ratingsQuantity: stats[0].nRating,
            ratingsAverage: stats[0].avgRating
        });
    }else{
        await Tour.findByIdAndUpdate(tourId, {
            ratingsQuantity: 0,
            ratingsAverage: 4.5,
        });
    }

    
}

reviewSchema.post('save', function() {
    this.constructor.calculateAverage(this.tour);
})

reviewSchema.pre(/^findOneAnd/, async function(next) {
    this.r = await this.findOne();
    next();
})

reviewSchema.post(/^findOneAnd/, async function() {
    await this.r.constructor.calculateAverage(this.r.tour);
})

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;