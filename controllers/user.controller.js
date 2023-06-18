const router = require('express').Router()
const passport = require('passport')
const User = require('../models/user.model')
const Trip = require('../models/trip.model')
const {upload, uploadImage, setCloudinaryFolder} = require('../configs/cloudinary.config')
const {autheticatedUserPage} = require('../configs/securePage.config')

router.get('/register', (req, res) => {
    return res.render('user/register')
})

router.get('/login', (req, res) => {
    return res.render('user/login')
})

router.post('/', upload.single('profilePicture'), async (req, res) => {
    try {

        const newUser = new User(req.body)
        if (req.file) {
            setCloudinaryFolder('user/profilePicture')
            const imageDetails = await uploadImage(req.file)
            newUser.profilePicture = imageDetails.secure_url
        }
    
        await newUser.save()
        return res.redirect('/user/login')
    } catch (err) {
        console.log(err)
        return res.redirect('/user/register')
    }
})

router.post('/login',
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/user/login",
        successFlash: "Successfully logged in",
    })
)

router.post('/login/google', 
    passport.authenticate('google', {
        scope: ['profile', 'email'],
        prompt: 'select_account'
    })
)

router.get('/login/google/callback', 
    passport.authenticate('google', {
        successRedirect: "/",
        failureRedirect: "/user/login",
        successFlash: "Successfully logged in",
    })
)

router.delete('/logout', function (req, res, next) {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash("success", "Successfully logged out!");
        res.redirect("/user/login");
    })
})

router.post('/:userId/trip/:tripId', autheticatedUserPage, async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.params.userId, {
            $push: {
                favorites: req.params.tripId,
            }
        })
        await Trip.findByIdAndUpdate(req.params.tripId, {
            $push: {
                favoritedBy: req.params.userId,
            }
        })
        return res.redirect(req.get('referer'))
    } catch (err) {
        console.log(err)
        return res.render('/error/500')
    }
})

router.delete('/:userId/trip/:tripId', autheticatedUserPage, async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.params.userId, {
            $pull: {
                favorites: req.params.tripId,
            }
        })
        await Trip.findByIdAndUpdate(req.params.tripId, {
            $pull: {
                favoritedBy: req.params.userId,
            }
        })
        return res.redirect(req.get('referer'))
    } catch (err) {
        console.log(err)
        return res.render('/error/500')
    }
})

module.exports = router