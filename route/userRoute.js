const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');


const router = express.Router();

router.post('/signup', authController.signup);

router.post('/login', authController.signin);

// router.get('/me', authController.protect, userController.getOneUser)

router.post('/forgotPassword', authController.forgetPassword);

router.patch('/resetPassword/:token', authController.resetPassword);

router.patch('/changePassword', authController.protect, authController.updatePassword);

router.patch('/updateData', authController.protect, userController.uploadPhoto, userController.updateMe);

router.delete('/deleteMe', authController.protect, userController.deleteMe);

router.route('/').get(userController.getAllUsers).post(userController.createUser);

router.route('/:id').get(userController.getUser).patch(userController.updateUser).delete(userController.deleteUser);

router.route('/preference').post(authController.protect, userController.setPreference);

router.route('/userLoginDets').get(authController.getLoginDetails)

router.route('/updateProgress').post(authController.protect, userController.setProgress)

router.route('/getProgress/:userId').get(authController.protect, userController.getProgress)

router.get('/getUser/:id', authController.protect, userController.getOneUser)

router.get('/getMyMealPlan/:id', mealPlanController.getMyMealPlan)

module.exports = router;
