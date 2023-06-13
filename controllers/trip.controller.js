const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.render('trip/index')
})

module.exports = router