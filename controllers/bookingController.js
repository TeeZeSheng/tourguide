const User = require('../models/User');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const Tour = require('./../models/Tour');
const Stripe = require('stripe')

const stripe = Stripe('sk_test_51PLEzyKRO5k2Lh6gEYxgLAYgmv2QwG87ZRg5RswvMKQV6YtqRxvuy5FPkH9w8jJMm4l5g7HmaXM7xvaU2sjqGdOE00DpTXhOLz');

exports.getCheckoutSession =  catchAsync(async (req, res, next) => {
    const tour = await Tour.findById(req.params.tourId);

    const priceId = req.params.priceId;

    const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [
        {
        price: priceId,
        // For metered billing, do not pass quantity
        quantity: 1,
        },
    ],
    // {CHECKOUT_SESSION_ID} is a string literal; do not change it!
    // the actual Session ID is returned in the query parameter when your customer
    // is redirected to the success page.
    success_url: 'https://example.com/success.html?session_id={CHECKOUT_SESSION_ID}',
    cancel_url: 'https://example.com/canceled.html',
    });

    const user = await User.findByIdAndUpdate(req.user._id, {
        role: 'sub',
    });

    if(!user) {
        return next(new AppError("user not found", 404));
    }

    res.status(200).json({
        status: 'success',
        session
    })
})