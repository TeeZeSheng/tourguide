const Review = require('../models/Review');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('./../utils/apiFeatures');

exports.getAllReviews = catchAsync( async (req, res, next) => {
    
    let filter = {};
    if (req.params.tourId) {
        filter = {tour: req.params.tourId}
    }
    const features = new APIFeatures(Review.find(filter), req.query).filter().sort().limitFields().paginate();
    const reviews = await features.query;

    res.status(200).json({
        status: 'success',
        results: reviews.length,
        message: 'successfully get all reviews',
        data: {
            reviews
        },
    })
});

exports.createReviews = catchAsync( async (req, res, next) => {
    if(!req.body.tour) {
        req.body.tour = req.params.tourId;
    }

    if(!req.body.user) {
        req.body.user = req.user.id;
    }

    const newReview = await Review.create(req.body);

    res.status(201).json({
        status: 'success',
        data:{
            review: newReview,
        },
    });
});

exports.deleteReview = catchAsync(async (req, res, next) => {
    const review = await Review.findByIdAndDelete(req.params.id);
    
    if (!review) {
        return next(new AppError('review does not exists!', 404));
    }
    
        res.status(204).json({
            status: 'success',
            message: 'review deleted',
        })
    
})


