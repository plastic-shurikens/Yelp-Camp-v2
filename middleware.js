const Campground = require('./models/campground');
const Review = require('./models/review');
const { campSchema, reviewSchema } = require('./schemaValidation');
const ExpressError = require('./utils/ExpressError');


module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in');
        return res.redirect('/login');
    }
    next();
}

module.exports.validateCamp = (req, res, next) => {
    const {error} = campSchema.validate(req.body);
    if(error){
        const msg = error.details.map(e => e.message).join(', ')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.authorized = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(req.params.id);
    if(!campground.author.equals(req.user._id)){
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/campgrounds/${id}`);
     }
   
    next();
}

module.exports.authorizedReview = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(req.params.reviewId);
    if(!review.author.equals(req.user._id)){
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/campgrounds/${id}`);
     }
   
    next();
}

module.exports.validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
    if(error){
        console.log(error)
        const msg = error.details.map(e => e.message).join(', ')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}