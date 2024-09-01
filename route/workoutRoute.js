const express = require('express');
const workoutController = require('./../controllers/workoutController');
const authController = require('./../controllers/authController');
const userController = require('./../controllers/userController')

const router = express.Router();

router
    .route('/all')
    .get( workoutController.getWorkout )
    .post( workoutController.createWorkout )

router.get('/save/:workoutId', authController.protect, workoutController.saveWorkout );

router.get('/viewWorkout', authController.protect, workoutController.viewWorkout);

router.get('/:workoutId', workoutController.getOneWorkout)

router.get('/getCustomWorkout', authController.protect, workoutController.getCustomWorkout)

router.delete('/:id', authController.protect, workoutController.deleteWorkout)

router.get('/workoutSpot/:id', workoutController.getWorkoutSpotlight)

module.exports = router;