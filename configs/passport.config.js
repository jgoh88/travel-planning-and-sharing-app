const passport = require("passport")
const LocalStrategy = require("passport-local")
const User = require("../models/user.model")

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
  
module.exports = passport;