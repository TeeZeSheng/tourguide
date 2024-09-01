const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator')
const User = require('./User');

const mealPlanSchema = mongoose.Schema({
   name: {
    type: String,
    required: [true, 'name cannot be blank!'],
   },
   meal: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Meal',
    }
  ],
  image: {
    type: String
  }
})

const MealPlan = mongoose.model('MealPlan', mealPlanSchema);

module.exports = MealPlan;
