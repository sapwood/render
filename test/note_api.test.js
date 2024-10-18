const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Note = require('../models/note')
const api = supertest(app)

const initialNotes = [
    {
        content : 'HTML is easy',
        important : false
    },
    {
        content : 'Browser can execute only JavaScript',
        important : true
    }
]

beforeEach(async () => {
    await Note.deleteMany({})
    let newObject = new Note(initialNotes[0])
    await newObject.save()
    newObject = new Note(initialNotes[1])
    await newObject.save()
})

test('notes are returned as json', async () => {
    await api
        .get('/api/notes')
        .expect(200)
        .expect('Content-Type',/application\/json/)
})

test('there are two notes', async () => {
    const response = await api.get('/api/notes')
    assert.strictEqual(response.body.length,initialNotes.length)
})

test('The first note is HTTP method', async () => {
    const response = await api.get('/api/notes')
    const contents = response.body.map(e => e.content)
    assert(contents.includes('HTML is easy'))


})

after(async () => {
    await mongoose.connection.close()
})