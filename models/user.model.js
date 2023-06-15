const mongoose = require('mongoose')
const bcrypt = require("bcrypt")
const Schema = mongoose.Schema

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    profilePicture: {
        type: String,
        default: 'https://icon-library.com/images/default-profile-icon/default-profile-icon-24.jpg',
    },
    favorites: [
        {
            type: mongoose.ObjectId,
            ref: 'Trip',
        }
    ],
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
}, {timestamps: true})

userSchema.pre("save", function (next) {
    const user = this
    if (!user.isModified("password")) {
        return next()
    }
    user.password = bcrypt.hashSync(user.password, 10)
    next()
})

userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
}

const User = mongoose.model('User', userSchema)

module.exports = User