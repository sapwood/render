const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRoute = require('express').Router()
const User = require('../models/users')

loginRoute.post('/', async (request,response) => {
    const { username, password } = request.body
    console.log(`username is ${username}, password is ${password}`)
    const user = await User.findOne({ username })
    console.log(`user is ${user}`)
    const passwordCorrect = user === null ? false : await bcrypt.compare(password,user.passwordHash)

    if (!(user&&passwordCorrect)){
        response.status(401).json({
            error: 'invalid username or password'
        })
    }

    const userForToken = {
        username : user.username,
        id : user._id
    }
    const token = jwt.sign(userForToken,process.env.SECRET,{ expiresIn:60*60 })

    response.status(200).send({ token, username:user.username, name:user.name })
})

module.exports = loginRoute