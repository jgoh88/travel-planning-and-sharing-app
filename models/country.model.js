const mongoose = require('mongoose')
const Schema = mongoose.Schema

const countrySchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    cities: [
        {
            name: String,
            image: String,
        }
    ],
    description: String,
    timeToVisit: String,
    image: {
        type: String,
        required: true,
    },
})

const Country = mongoose.model('Country', countrySchema)

module.exports = Country