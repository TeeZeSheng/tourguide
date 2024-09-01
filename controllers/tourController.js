const Tour = require('./../models/Tour');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./factoryHandler');
const APIFeatures = require('./../utils/apiFeatures')
const multer = require('multer');

const multerStoraage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true)
    }else {
        cb(new AppError('please upload an iamge', 400), false)
    }
}

const upload = multer({ 
    storage: multerStoraage,
    fileFilter: multerFilter,
});

exports.uploadTourImages = upload.fields([
    {name: 'imageCover', maxCount: 1},
    {name: 'images', maxCount: 3}
]);

exports.checkBody = (req, res, next) => {
    console.log('middleware');
    if(!req.body.name || !req.body.price) {
        return res.status(400).json({
            status: 'fail',
            message: 'Missing name or price'
        })
    }
    next();
}

exports.aliasTopTours = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
};


exports.getAllTours = catchAsync(async (req, res, next) => {
    const features = new APIFeatures(Tour.find(), req.query).filter().sort().limitFields().paginate();
    const tours = await features.query;

    res.status(200).json({
        status: "success",
        data: {
            tours
        },
        results: tours.length
    });
})

exports.getTourStats = catchAsync(async (req, res, next) => {
    const stats = await Tour.aggregate([
        {
            $match: { ratingsAverage: {$gte: 4.5}}
        },
        {
            $group: {
                _id: { $toUpper: '$difficulty'},
                num: { $sum: 1},
                nRatings: { $sum: '$ratingsQuantity'},
                avgRating: { $avg: '$ratingsAverage'},
                avgPrice: { $avg: '$price'},
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price'}
            }
        },
        {
            $sort: {
                avgRating: 1
            }
        }
    ]);

    res.status(200).json({
        status: 'success',
        data: {
            stats
        }
    })
})

exports.getTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findById(req.params.id);

    if (!tour) {
        return next(new AppError('Tour does not exists!', 404));
    }

        res.status(200).json({
            status: "success",
            data: {
                tour
            }
        });
})



exports.createTours = factory.createOne(Tour);

exports.updateTour = factory.updateOne(Tour);

exports.deleteTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findByIdAndDelete(req.params.id);
    
    if (!tour) {
        return next(new AppError('Tour does not exists!', 404));
    }
    
        res.status(204).json({
            status: 'success',
            message: 'tour deleted',
        })
    
})

exports.getMonthlyPlan = catchAsync(async(req, res, next) => {
    const year = req.params.year * 1;

        const plan = await Tour.aggregate([
            {
                $unwind: '$startDates'
            },
            {
                $match: {
                    startDate: {
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`)
                    }
                }
            },
            {
                $group:{
                    _id: { $month: '$startDate'}, 
                    numTourStarts: { $add: 1},
                    tours: { $push: '$name'},
                }
            },
            {
                $addFields:{
                    month: '$_id',
                }
            },
            {
                $project:{
                    //determine whether the field will show up or not
                    _id: 0
                }
            },
            {
                $sort:{
                    numTourStarts: 1
                }
            },
            {
                $limit: 6
            }
        ])

        res.status(200).json({
            status: 'success',
            data: {
                plan
            }
        })
})

exports.getTourWithin = (req, res, next) => {
    const { distance, latlng, unit } = req.params;
    const [lat, lng] = latlng.split(',');

    if(!lat || !lng) {
        next(new AppError('Please provide complete long and lat', 400));
    }

    res.status(200).json({
        status: 'success',
    })
}