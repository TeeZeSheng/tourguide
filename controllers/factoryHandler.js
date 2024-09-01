const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.updateOne = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    })

    if (!doc) {
        return next(new AppError('doc does not exists!', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            data: doc
        }
    })
    
})

exports.createOne = Model => catchAsync(
    async (req, res, next) => {
        const doc = await Model.create(req.body);
    
        res.status(201).json({
            status: "success",
            data: {
                data: doc
            }
        });
       
    }
)

exports.getOne = (Model, popOptions) => catchAsync( async (req, res, next) => {
    let query = await Model.findById(req.params.id);
    if (popOptions) {
       query =  query.populate(popOptions);
    }
    const doc = await query;

    if(!doc) {
        return next(new AppError('Not found', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            data: doc
        }
    })
})