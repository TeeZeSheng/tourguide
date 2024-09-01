const express = require('express');
const authController = require('./../controllers/authController');
const bookingController = require('./../controllers/bookingController');
const mealController = require('./../controllers/mealController');
const mealPlanController = require('./../controllers/mealPlanController');


const router = express.Router();

// router.use(authController.protect, authController.restrictTo('sub'));

router.get('/', mealController.getMealPlan);
router.post('/',mealController.createMealPlan);
router
    .route('/')
    .patch(mealController.editMealPlan)
    .delete(mealController.deleteMealPlan)

router.post('/mealPlan', mealPlanController.createMealPlan)
router.get('/getMealPlan', mealPlanController.getMealPlan)
router.post('/saveMealPlan', authController.protect, mealPlanController.saveMealPlan)
router.get('/getUserMealPlan', authController.protect, mealPlanController.getUserMealPlan)
router.delete('/:id', authController.protect, mealPlanController.deleteMealPlan)
router.get('/:id', mealController.getOneMeal)
router.get('/mealSpot/:id', mealPlanController.getMealSpotlight)
module.exports = router;