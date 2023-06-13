const router = require('express').Router()
const Country = require('../models/country.model')
const {upload, uploadImage, setCloudinaryFolder} = require('../configs/cloudinary.config')

router.get('/', (req, res) => {
    return res.render('admin/admin')
})

router.get('/country', (req, res) => {
    return res.render('admin/country/list')
})

router.get('/country/new', (req, res) => {
    return res.render('admin/country/create')
})

// router.get('/country/city')

router.post('/country/new', upload.single('image'), async (req, res) => {

    try {
        const newCountry = new Country(req.body)
        if (req.file) {
            const imageDetails = await uploadImage(req)
            newCountry.image = imageDetails.secure_url
        }
    
        await newCountry.save()
        return res.redirect('/admin/country/new')
    } catch (err) {
        console.log(err)
        return res.redirect('/admin/country/new')
    }
})

module.exports = router