const express = require('express');
const app = express ();
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');



const userRoute = require('./route/userRoute');
const workoutRoute = require('./route/workoutRoute')
const mealRoute = require('./route/mealRoute')
const exerciseRoute = require('./route/exerciseRoute')
const bookingRoute = require('./route/bookingRoute')
const tourRoute = require('./route/tourRoute');
const reviewRoute = require('./route/reviewRoute');
const AppError = require('./utils/appError');
const errorHandler = require('./controllers/errorController');

app.use(helmet())

if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests at the moment',
});

app.use('/api', limiter);

app.use(express.json());
//app.use(express.static(`${__dirname}/public`));

app.use(mongoSanitize());
app.use(xss());
app.use(hpp({
    whitelist: [
        'duration',
        'ratingsQuantity',
        'ratingsAverage',
        'maxGroupSize',
        'difficulty',
        'price'
    ]
}));

app.use(cors());

// const corsOptions = {
//     origin: 
// }


app.use('/api/v1/users', userRoute);
app.use('/api/v1/workouts', workoutRoute);
app.use('/api/v1/meal', mealRoute);
app.use('/api/v1/exercise', exerciseRoute);
app.use('/api/v1/booking', bookingRoute);
app.use('/api/v1/tours', tourRoute);
// app.use('/api/v1/reviews', reviewRoute);

app.all('*', (req, res, next) => {

    next(new AppError(`Can't find ${req.originalUrl}`, 404));
});

app.use(errorHandler);


module.exports = app;

// app.get("/status", (req, res) => {
//     const status = {
//         'status': "running"
//     }

//     res.send(status)
// } );

// app.post("/posting", (req, res) => {
    
//     console.log( req )
// })

// app.get('/api/v1/tours', (req, res) => {
//     res.status(200).json({
//         status: 'success',
//         data: {
//             tours: "tours"
//         }
//     })

// })

// app.post('/api/v1/tours', (req, res) => {
//     console.log(req.body);
//     res.send("done");
// })

// app.get('/api/v1/tours/:id', (req, res) => {
//     console.log(req.params.id);
    
//     res.status(200).json({
//         message: "ok"
//     })
// })







