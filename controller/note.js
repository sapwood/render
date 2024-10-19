const route = require('express').Router()
const Note = require('../models/note')
const User = require('../models/users')

route.get('/',async (request,response) => {
    const notes = await Note.find({}).populate('user',{ username:1, name:1 })
    response.json(notes)


})

route.get('/:id',async (request,response) => {
    const id = request.params.id
    const note = await Note.findById(id)
    if (note) {
        response.json(note)
    }
    else{
        response.status(404).end()
    }

})

route.delete('/:id',async (request,response) => {
    const id =request.params.id
    await Note.findByIdAndDelete(id)
    response.status(204).end()

})

route.put('/:id',async (request,response) => {
    const body = request.body
    const note = {
        content: body.content,
        important: body.important,
    }
    const result = await Note.findByIdAndUpdate(request.params.id,note,{ new:true,runValidators:true,context:'query' })
    response.json(result)

})

route.post('/',async (request,response) => {
    const body = request.body
    const user = await User.findById(body.userID)

    const note= new Note({
        content: body.content,
        important: body.important || false,
        user : user.id

    })
    const saveNote = await note.save()
    user.notes = user.notes.concat(saveNote._id)
    await user.save()
    response.json(saveNote)



})

module.exports = route