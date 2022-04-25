const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const Review = require('../models/reviewModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.alerts = (req, res, next) => {
    const { alert } = req.query;
    if (alert === 'booking')
        res.locals.alert = "Your booking was successful! Please check your email confirmation. If you doesn't show up here immediately, please come back later.";

    if (alert === 'notLoggedin')
        res.locals.alert = "You're not loggedin. Please login to get access!";

    next();
};

exports.getOverview = catchAsync(async (req, res, next) => {
    // 1) Get tour data from collection 
    const tours = await Tour.find();

    // 2) Build template
    // 3) Render that template using tour data from 1)
    res.status(200).render('overview', {
        title: 'All Tours',
        tours
    });
});

exports.getTour = catchAsync(async (req, res, next) => {
    // 1) Get the data, for the request tour (including reviews and guides)
    const tour = await Tour.findOne({ slug: req.params.slug }).populate({
        path: 'reviews',
        fields: 'review rating user'
    });

    if (!tour) {
        return next( new AppError('There is no tour with that name.', 404));
    }

    if (res.locals.user) {
        const bookings = await Booking.find({
          user: res.locals.user.id,
          tour: tour.id
        });
        res.locals.isBookedTour = bookings.length > 0;
    }
    
    // 2) Build template
    // 3) Render that template using data from 1)
    res.status(200).render('tour', {
        title: `${tour.name} Tour`,
        tour
    });
});

exports.getSignupForm = (req, res) => {
    if (res.locals.user) {
        return res.redirect('/');
    }

    res.status(200).render('signup', {
        title: 'Sign Up account'
    });
};

exports.getLoginForm = (req, res) => {
    if (res.locals.user) {
        return res.redirect('/');
    }
    
    res.status(200).render('login', {
        title: 'Log into your account'
    })
};

exports.getMyTours = catchAsync(async (req, res, next) => {
    // 1) Find all bookings
    const bookings = await Booking.find({ user: req.user.id});

    // 2 Find tours with  the returned IDs
    const tourIDs = bookings.map(el => el.tour);
    const tours = await Tour.find({ _id: { $in: tourIDs } });

    res.status(200).render('overview', {
        title: 'My Tours',
        tours
    });
});

exports.getAccount = (req, res) => {
    res.status(200).render('account', {
        title: 'Your Account'
    })
};

// exports.updateUserData = catchAsync(async(req, res, next) => {
//     const updateUser = await User.findByIdAndUpdate(req.user.id, {
//         name: req.body.name,
//         email: req.body.email,
//     },
//     {
//         new: true,
//         runValidators: true
//     });

//     res.status(200).render('account', {
//         title: 'Your Account',
//         user: updateUser
//     })
// });

exports.getMyReviews = catchAsync(async (req, res) => {
    const reviews = await Review.find({ user: req.user.id })
      .select('-user')
      .populate('tour');
    res.status(200).render('review', {
      title: 'My Reviews',
      reviews
    });
});
  
exports.getFavorites = catchAsync(async (req, res, next) => {
    const favoriteTours = await User.findById(req.user.id).select('favorite');
    res.status(200).render('overview', {
      title: 'My Favorites',
      tours: favoriteTours.favorite
    });
});