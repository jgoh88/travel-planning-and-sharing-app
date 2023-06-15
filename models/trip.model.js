const mongoose = require('mongoose')
const Schema = mongoose.Schema

const tripSchema = new Schema({
    name: String,
    country: {
        countryId: {
            type: mongoose.ObjectId,
            ref: 'Country',
            required: true,
        },
        countryName: {
            type: String,
            required: true
        }
    },
    createdBy: {
        type: mongoose.ObjectId,
        ref: 'User',
        required: true,
    },
    shared: {
        type: Boolean,
        default: false,
    },
    sharedAt: Date,
    description: String,
    images: [
        {
            url: String,
            publicID: String,
        }
    ],
    itinerary: [
        [{
            location: String,
            time: Date,
            note: String,
        }]
    ],
    favoritedBy: [
        {
            type: mongoose.ObjectId,
            ref: 'User',
        }
    ],
}, {timestamps: true})

const Trip = mongoose.model('Trip', tripSchema)

module.exports = Trip