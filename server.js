// Import modules
const express = require('express')
const mongoose = require('mongoose')
const expressLayouts = require('express-ejs-layouts')
const passport = require("./configs/passport.config")
const methodOverride = require('method-override')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const flash = require('connect-flash')
require('dotenv').config()
const Trip = require('./models/trip.model')
const User = require('./models/user.model')

// Import routers/controllers
const tripController = require('./controllers/trip.controller')
const userController = require('./controllers/user.controller')
const adminController = require('./controllers/admin.controller')
const countryController = require('./controllers/country.controller')

// Initialize modules
const server = express()
const PORT = process.env.PORT
mongoose.connect(process.env.MONGO_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Mongo connected"));
server.set('view engine', 'ejs')

// Use middlewares
server.use(express.urlencoded({extended: true}))
server.use(expressLayouts)
server.use(methodOverride('_method'))
server.use(express.static('public'))
server.use(
    session({
        secret: process.env.SECRET,
        saveUninitialized: true,
        resave: false,
        cookie: { maxAge: 3600000 },
        store: MongoStore.create({
            mongoUrl: process.env.MONGO_DB,
        }),
    })
)
server.use(passport.initialize())
server.use(passport.session())
server.use(flash())

server.use(function (request, response, next) {
    response.locals.alerts = request.flash(); //{ success: [], error: []}
    console.log('Flash message:', response.locals.alerts)
    response.locals.currentUser = request.user; //Makes logged in user accessibile in ejs as currentUser.
    next()
})

server.get('/', async (req, res) => {
    const trips = await Trip.find({shared: true}).limit(10).sort({sharedAt: -1}).populate('country')
    res.render('trip/index', {trips: trips, user: req.user})
})

// Use routers/controllers
server.use('/trip', tripController)
server.use('/user', userController)
server.use('/admin', adminController)
server.use('/country', countryController)

// Run server
server.listen(PORT, () => console.log(`Running on port ${PORT}`))
