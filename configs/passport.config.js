const passport = require("passport")
const LocalStrategy = require("passport-local")
// const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
const GoogleStrategy = require('passport-google-oauth20').Strategy
const User = require("../models/user.model")
require('dotenv').config()

passport.serializeUser(function (user, cb) {
    cb(null, user.id);
})

passport.deserializeUser(function (id, cb) {
    User.findById(id)
        .then((user) => {
            cb(null, user);
        })
        .catch((err) => {
            cb(err, false);
        })
})

passport.use(
    new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "password",
        },
        function (email, password, cb) {
            User.findOne({ email: email })
                .then((user) => {
                    if (!user) {
                        return cb(null, false, { message: "Username or password not a match" })
                    }
                    //check if password is a match
                    if (!user.validPassword(password)) {
                        return cb(null, false, { message: "Username or password not a match" })
                    }
                    return cb(null, user);
                })
                .catch((err) => {
                    cb(err)
                })
        }
    )
)

passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
    }, 
    function (accessToken, refreshToken, profile, cb) {
        User.findOneAndUpdate({
            account: {
                accountType: profile.provider,
                federatedAccountId: profile.id
            }
        }, {
            $set: {
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                email: profile.emails[0].value,
                password: accessToken,
                account: {
                    accountType: profile.provider,
                    federatedAccountId: profile.id,
                },
                profilePicture: profile.photos[0].value ?? 'https://icon-library.com/images/default-profile-icon/default-profile-icon-24.jpg'
            }
        }, {
            upsert: true,
            returnDocument: 'after',
        })
        .then((user) => {
            return cb(null, user)
        })
        .catch((err) => {
            console.log(err)
        })
    })
)

module.exports = passport;