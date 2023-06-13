const mongoose = require('mongoose')
const Schema = mongoose.Schema

const tripSchema = new Schema({
    name: String,
    country: {
        type: mongoose.ObjectId,
        ref: 'Country',
        required: true,
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
    description: String,
    itinerary: [
        [{
            location: String,
            time: Date,
            note: String,
        }]
    ]
}, {timestamps: true})

const Trip = mongoose.model('Trip', tripSchema)

module.exports = Trip