const router = require('express').Router()
const Trip = require('../models/trip.model')
const Country = require('../models/country.model')
const User = require('../models/user.model')
const {upload, uploadImage, setCloudinaryFolder} = require('../configs/cloudinary.config')
const {autheticatedUserPage} = require('../configs/securePage.config')

router.get('/my', autheticatedUserPage, async (req, res) => {
    try {
        const trips = await Trip.find({createdBy: req.user._id})
            .populate({
                path: 'country',
                populate: {
                    path: 'countryId'
                }
            })
        const countries = await Country.find()
        return res.render('trip/userList', {trips: trips, countries: countries})
    } catch (err) {
        console.log(err)
        return res.render('error/500')
    }
})

router.get('/favorites', autheticatedUserPage, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate({
            path: 'favorites',
            populate: {
                path: 'country',
                populate: {
                    path: 'countryId'
                }
            }
        })
        const trips = user.favorites
        return res.render('trip/favoriteList', {trips: trips, user: req.user})
    } catch (err) {
        console.log(err)
        return res.render('error/500')
    }
})

router.get('/search', async (req, res) => {
    try {
        const keywords = req.query.searchTerm.split(' ')
        const regex = keywords.join('|')
        const trips = await Trip.find({
            shared: true,
            $or: [
                {name: {
                        $regex: regex, $options: 'i'
                }},
                {description: {
                        $regex: regex, $options: 'i'
                }},
                {country: {
                        countryName: {
                            $regex: regex, $options: 'i'
                        }
                }},
            ],
        })
        return res.render('trip/searchList', {trips: trips, user: req.user, searchTerm: req.query.searchTerm})
    } catch (err) {
        console.log(err)
        return res.render('error/500')
    }
})

router.get('/:id', autheticatedUserPage, async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id)
        return res.render('trip/show', {trip: trip})
    } catch (err) {
        console.log(err)
        return res.render('error/500')
    }
})

router.get('/:id/edit', autheticatedUserPage, async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id)
            .populate({
                path: 'country',
                populate: {
                    path: 'countryId',
                }
            })
        const countries = await Country.find()

        return res.render('trip/edit', {trip: trip, countries: countries})
    } catch (err) {
        console.log(err)
        return res.render('error/500')
    }
})

router.post('/', autheticatedUserPage, async (req, res) => {
    try {
        const newTrip = new Trip({...req.body, createdBy: req.user.id})
        const countryData = await Country.findById(newTrip.country.countryId)
        newTrip.country.countryName = countryData.name
        await newTrip.save()

        // Removing below for now 
        // await User.findById(req.user.id, {
        //     $push: {
        //         trips: newTrip._id
        //     }
        // })

        return res.redirect(`/trip/${newTrip._id}/edit`)
    } catch (err) {
        console.log(err)
        return res.redirect(`/trip/my`)
    }
})

router.put('/:id', autheticatedUserPage, async (req, res) => {
    try {
        const updatedTrip = req.body
        updatedTrip.itinerary.forEach((day) => {
            day.forEach((place) => {
                if (!place.time) {
                    place.time = null
                    return
                }
                const d = new Date();
                place.time = new Date(d.toString().split(":")[0].slice(0,-2) + place.time)
            })
        })
        const countryData = await Country.findById(updatedTrip.country.countryId)
        updatedTrip.country.countryName = countryData.name
        await Trip.findByIdAndUpdate(req.params.id, {
            $set: {
                ...updatedTrip
            }
        })
        return res.redirect(`/trip/my`)
    } catch (err) {
        console.log(err)
        return res.redirect(`/trip/${req.params.id}/edit`)
    }
})

router.patch('/:id', [autheticatedUserPage, upload.array('image', 10)], async (req, res) => {
    try {
        const sharedTrip = req.body
        sharedTrip.shared = true
        sharedTrip.sharedAt = new Date()
        if (req.files) {
            sharedTrip.images = []
            setCloudinaryFolder('trip/images')

            for (file of req.files) {
                const imageDetails = await uploadImage(file)
                sharedTrip.images.push({url: imageDetails.secure_url, publicID: imageDetails.public_id})
            }
        }
        await Trip.findByIdAndUpdate(req.params.id, {
            $set: {
                ...sharedTrip
            }
        })
    } catch (err) {
        console.log(err)
    } finally {
        return res.redirect(`/trip/my`)
    }
})

router.delete('/:id', autheticatedUserPage, async (req, res) => {
    try {
        await Trip.findByIdAndDelete(req.params.id)
        return res.redirect(`/trip/my`)
    } catch (err) {
        console.log(err)
        return res.render('error/500')
    }
})

module.exports = router