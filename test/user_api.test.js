const { test, describe, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const User = require('../models/users')
const bcrypt = require('bcrypt')
const supertest = require('supertest')
const app = require('../app')
const { default: mongoose } = require('mongoose')
const api = supertest(app)
const helper = require('../utils/helper')

describe('when there is initially one user in db', async () => {
    beforeEach(async () => {
        await User.deleteMany({})
        const passwordHash = await bcrypt.hash('root',10)
        const newUser = new User({
            username : 'root',
            passwordHash,
        })
        await newUser.save()
    })

    test('create a fresh new name', async () => {
        const userAtStart = await helper.userInDB()
        const newUser = {
            username: 'mluukkai',
            name: 'Matti Luukkainen',
            password: 'salainen',
        }
        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type',/application\/json/)

        const userAtEnd = await helper.userInDB()

        assert.strictEqual(userAtEnd.length,userAtStart.length+1)
        const usernames = userAtEnd.map(u => u.username)

        assert(usernames.includes(newUser.username))
    })

    test('creation fails if username already taken', async () => {
        const newUser = {
            username: 'root',
            name: 'Superuser',
            password: 'salainen',
        }
        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type',/application\/json/)
        assert(result.body.error.includes('expected `username` to be unique'))

    })


})
after(async () => {
    await mongoose.connection.close()
})

