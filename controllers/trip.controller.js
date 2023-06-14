const router = require('express').Router()
const Trip = require('../models/trip.model')
const Country = require('../models/country.model')
const {upload, uploadImage, setCloudinaryFolder} = require('../configs/cloudinary.config')

router.get('/:id', async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id).populate('country')
        return res.render('trip/show', {trip: trip})
    } catch (err) {
        console.log(err)
        return res.render('error/500')
    }
})

router.get('/:id/edit', async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id).populate('country')
        const countries = await Country.find()

        return res.render('trip/edit', {trip: trip, countries: countries})
    } catch (err) {
        console.log(err)
        return res.render('error/500')
    }
})

router.get('/user/:id', async (req, res) => {
    try {
        const trips = await Trip.find({createdBy: req.user.id}).populate('country')
        const countries = await Country.find()
        return res.render('trip/userList', {trips: trips, countries: countries})
    } catch (err) {
        console.log(err)
        return res.render('error/500')
    }
})

router.post('/', async (req, res) => {
    try {
        const newTrip = new Trip({...req.body, createdBy: req.user.id})
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
        return res.redirect(`/trip/user/${req.user.id}`)
    }
})

router.put('/:id', async (req, res) => {
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
        await Trip.findByIdAndUpdate(req.params.id, {
            $set: {
                ...updatedTrip
            }
        })
        return res.redirect(`/trip/user/${req.user.id}`)
    } catch (err) {
        console.log(err)
        return res.redirect(`/trip/${req.params.id}/edit`)
    }
})

router.patch('/:id', upload.array('image', 10), async (req, res) => {
    try {
        const sharedTrip = req.body
        sharedTrip.shared = true
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
        return res.redirect(`/trip/user/${req.user.id}`)
    }
})

router.delete('/:id', async (req, res) => {
    try {
        await Trip.findByIdAndDelete(req.params.id)
        return res.redirect(`/trip/user/${req.user.id}`)
    } catch (err) {
        console.log(err)
        return res.render('error/500')
    }
})

module.exports = router