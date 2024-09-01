const User = require("../models/User")
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

exports.deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, {active: false});

    res.status(204).json({
        status: 'success',
        data: null,
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
