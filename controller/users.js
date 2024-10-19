const usersRoute = require('express').Router()

const User = require('../models/users')

const bcrypt = require('bcrypt')

usersRoute.get('/', async (request,response) => {
    const result = await User.find({}).populate('notes',{ content:1,important:1 })
    response.json(result)

})


usersRoute.post('/', async (request, response) => {
    const { username, name, password } = request.body
    const saltRound = 10
    const passwordHash = await bcrypt.hash(password,saltRound)

    const newUser = new User({
        username,
        name,
        passwordHash,
    })
    const savedUser = await newUser.save()
    response.status(201).json(savedUser)

})

module.exports = usersRoute