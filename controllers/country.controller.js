const router = require('express').Router()
const Country = require('../models/country.model')

router.get('/', async (req, res) => {
    try {
        const countries = await Country.find().sort({name: 1})
        return res.render('country/list', {countries: countries})
    } catch (err) {
        console.log(err)
        return res.render('error/500')
    }
})

router.get('/:id', async (req, res) => {
    try {
        const country = await Country.findById(req.params.id)
        return res.render('country/show', {country: country})
    } catch (err) {
        console.log(err)
        return res.render('error/500')
    }
})

module.exports = router