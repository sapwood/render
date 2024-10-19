const express = require('express')
const cors = require('cors')
const app=express()
require('express-async-errors')
const middleware = require('./utils/middleware')
const config = require('./utils/config')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

const url = config.MONGODB_URI




mongoose.connect(url)
    .then(() => {
        logger.info('connected to MongoDB')
    })
    .catch(error => {
        logger.error('error connecting to MongoDB:', error.message)
    })


app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(middleware.requestLogger)

const route = require('./controller/note')
const usersRoute = require('./controller/users')

app.use('/api/notes',route)
app.use('/api/users',usersRoute)


app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports= app

