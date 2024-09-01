const User = require("../models/User")
const Progress = require("../models/Progress")
const AppError = require("../utils/appError")
const catchAsync = require("../utils/catchAsync")
const multer = require('multer');

const multerStoraage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/img/users');
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split('/')[1];
        cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);

    }
})

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

exports.uploadPhoto = upload.single('photo');

// exports.resizeUserPhoto = (req, res, next) => {
//     if (!req.file) return next();

//     req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`

//     sharp(req.file.buffer).resize(500, 500).toFormat('jpeg').jpeg({quality: 90}).toFIle(`public/img/users/${req.file.filename}`);

//     next();
// }


const filterObj = (obj, ...allowedFields) => {
    let newObj = {};
    Object.keys(obj).forEach(el => {
        if(allowedFields.includes(el)){
            newObj[el] = obj[el];
        }
    });
    return newObj;
}

exports.getAllUsers = catchAsync(async (req, res, next) => {
    const user = await User.find();

    res.status(200).json({
        status: 'success',
        data: {
            user: user
        },
        
    })
})

exports.createUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'route not yet defiend",'
    })
}

exports.getUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'route not yet defiend",'
    })
}

exports.updateUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'route not yet defiend",'
    })
}

exports.deleteUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'route not yet defiend",'
    })
}

exports.getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
}

exports.updateMe = catchAsync(async (req, res, next) => {
    if (req.body.password || req.body.passwordConfirm) {
        return next(new AppError('Not allowed to update password', 404));
    }

    const filteredBody = filterObj(req.body, 'name', 'email', 'level', 'goal');
    if (req.file) filteredBody.photo = req.file.filename;

    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser
        }
    })


})

exports.setPreference = catchAsync( async (req, res, next) => {
    const { level, goal } = req.body;

    const user = await User.findById(req.user.id);
    user.level = level;
    user.goal = goal;
    await user.save();

    if(!user) {
        return next(new AppError('user not found', 400));
    }

    res.status(200).json({
        status: 'success',

    })
})

exports.deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, {active: false});

    res.status(204).json({
        status: 'success',
        data: null,
    })
})

exports.setProgress = catchAsync( async (req, res, next) => {
    const progress = await Progress.create({
        workout: req.body.name,
        date: req.body.date,
        user: req.body.user
    })

    res.status(200).json({
        status: 'success',

    })
})

exports.getProgress = catchAsync( async (req, res, next) => {
    const progress = await Progress.aggregate([
        {
            $lookup: {
              from: 'workouts', // Name of the collection to join
              localField: 'workout', // Field from the orders collection
              foreignField: '_id', // Field from the users collection
              as: 'workoutItems', // Name of the array field to add to the output documents
            }
          },
          {
            $unwind: '$workoutItems' // Unwind the array to include user details as an object
          },
        {
            $match: { user: req.user._id }
        },
        
        {
            $sort: {
                date: -1
            }
        }
    ]);

    res.status(200).json({
        data: {
            progress
        }
    })
})

exports.getOneUser = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.params.id)

    res.status(200).json({
        status: 'sucess',
        data: {
            user
        }
    })
})