const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator')
const User = require('./User');

const tourSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, 'Tour name is required!'],
      unique: true,
      trim: true,
      maxlength: [40, 'cannot be more than 40 characters'],
      minlength: [10, 'must be more than 10 characters'],
      
    },
    slug: {
      type: String,
    },
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {values: ['easy', 'medium', 'difficult'],
        message: 'Invalid value. (Must be easy, medium, difficult',
      }
    },
    ratingsAverage: {
      type: Number,
      default: 0,
      //validators
      min: [0, 'Rating cannot be less than 0'],
      max: [5, 'Rating cannot be over 5']
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'Tour price is required!']
    },
    discount: {
      type: Number,
      //val is user input
      validate: {
        validator: function(val) {
          //only for new document
          return val < this.price;
        },
        message: "discount price ({VALUE}) cannot be greater than price"
      }
    },
    summary: {
      type: String, 
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have cover image'],
    },
    images: {
      type: [String],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: {
      type: [Date],
    },
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      coordinates: [Number],
      address: String,
      description: String
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number
      }
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      }
    ],
  },
  {
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
  });

tourSchema.virtual('durationWeeks').get(function() {
  return this.duration / 7
});

tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
})

tourSchema.index({price: 1, ratingsAverage: -1});
tourSchema.index({slug: 1});

//document middleware: runs before .save() and .create()
tourSchema.pre('save', function(next) {
  this.slug = slugify(this.name, {lower: true});
  next();
    
});

tourSchema.pre(/^find/, function(next) {
  this.find({ secretTour:  {$ne: true}});
  next();

});

tourSchema.pre(/^find/, function(next) {
  this.populate({
      path: 'guides',
      select: '-__v'
  });

//   this.populate({
//     path: 'reviews',
// })

  next()
})

// tourSchema.pre('save', async function(next) {
//   const guidePromise = this.guides.map(async id => {
    
//     return await User.findById(id);
   
    
//   })
//   this.guides = await Promise.all(guidePromise);
//   next();
// })

tourSchema.post(/^find/, function(docs, next) {
  console.log(`Query took ${Date.now()} millieseconds`);
  next();
})

//Aggregate
tourSchema.pre('aggregate', function(next) {
  this.pipeline().unshift({ $match: { secretTour: {$ne: true}} });
  next();
})

// tourSchema.pre('save', function(next) {
//   next();
// })

// tourSchema.post('save', function(doc, next) {
//   next();
// })

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;