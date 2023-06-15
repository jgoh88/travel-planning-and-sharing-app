const router = require('express').Router()
const Country = require('../models/country.model')
const cloudinary = require('cloudinary').v2
const {upload, uploadImage, setCloudinaryFolder} = require('../configs/cloudinary.config')
const {autheticatedUserPage, adminUserPage} = require('../configs/securePage.config')

router.get('/', [autheticatedUserPage, adminUserPage], (req, res) => {
    return res.render('admin/admin')
})

router.get('/country', [autheticatedUserPage, adminUserPage], async (req, res) => {
    try {
        const countries = await Country.find()
        return res.render('admin/country/list', {countries: countries})
    } catch (err) {
        console.log(err)
        return res.render('error/500')
    }  
})

router.get('/country/new', [autheticatedUserPage, adminUserPage], (req, res) => {
    return res.render('admin/country/create')
})

router.get('/country/:id', [autheticatedUserPage, adminUserPage], async (req, res) => {
    try {
        const country = await Country.findById(req.params.id)
        return res.render('admin/country/show', {country: country})
    } catch (err) {
        console.log(err)
        return res.redirect('error/500')
    }
})

router.get('/country/:id/edit', [autheticatedUserPage, adminUserPage], async (req, res) => {
    try {
        const country = await Country.findById(req.params.id)
        return res.render('admin/country/edit', {country: country})
    } catch (err) {
        console.log(err)
        return res.redirect('error/500')
    }
})

router.post('/country', [autheticatedUserPage, adminUserPage, upload.single('image')], async (req, res) => {

    try {
        const newCountry = new Country(req.body)
        if (req.file) {
            setCloudinaryFolder('admin/country')
            const imageDetails = await uploadImage(req.file)
            newCountry.image.url = imageDetails.secure_url
            newCountry.image.publicID = imageDetails.public_id
        }
    
        await newCountry.save()
        return res.redirect('/admin/country')
    } catch (err) {
        console.log(err)
        return res.redirect('/admin/country/new')
    }
})

router.put('/country/:id', [autheticatedUserPage, adminUserPage, upload.single('image')], async (req, res) => {
    try {
        const updatedCountry = req.body
        if (req.file) {
            setCloudinaryFolder('admin/country')
            const imageDetails = await uploadImage(req.file)
            updatedCountry.image = {}
            updatedCountry.image.url = imageDetails.secure_url
            updatedCountry.image.publicID = imageDetails.public_id
        }
        const beforeUpdateCountry = await Country.findByIdAndUpdate(req.params.id, {
            $set: {
                ...updatedCountry
            }
        })
        if (req.file) {
            await cloudinary.uploader.destroy(beforeUpdateCountry.image.publicID, 'image')
        }
        return res.redirect('/admin/country')
    } catch (err) {
        console.log(err)
        return res.redirect(`/admin/country/${req.params.id}/edit`)
    }
})

router.delete('/country/:id', [autheticatedUserPage, adminUserPage], async (req, res) => {
    try {
        const deletedCountry = await Country.findByIdAndDelete(req.params.id)
        await cloudinary.uploader.destroy(deletedCountry.image.publicID, 'image')
        return res.redirect('/admin/country')
    } catch (err) {
        console.log(err)
        return res.redirect(`/admin/country/${req.params.id}`)
    }
})

// For cities

// router.get('/country/:id/city/edit', async (req, res) => {
//     try {
//         const country = await Country.findById(req.params.id)
//         return res.render('admin/country/city/edit', {country: country})
//     } catch (err) {
//         console.log(err)
//         return res.redirect('error/500')
//     }
// })

// router.patch('/country/:id', upload.array('image'), async (req, res) => {
//     try {
//         console.log(req.body)
//         console.log('req.file:', req.file)
//         console.log('req.files:', req.files)
//     } catch (err) {
//         console.log(err)
//         return res.redirect(`/country/${req.params.id}/city/edit`)
//     }
// })

module.exports = router