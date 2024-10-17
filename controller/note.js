const route = require('express').Router()
const Note = require('../models/note')

route.get('/',(request,response) => {

    Note.find({}).then(notes => {
        response.json(notes)
    })

})

route.get('/:id',(request,response,next) => {
    const id = request.params.id
    Note.findById(id)
        .then(note => {
            if (note){
                response.json(note)
            }
            else{
                response.status(404).end()
            }
        })
        .catch(error => {
            next(error)
        })


})

route.delete('/:id',(request,response,next) => {
    const id =request.params.id

    Note.findByIdAndDelete(id)
        .then(() => {
            response.status(204).end()
        })
        .catch(error => {
            next(error)
        })

})

route.put('/:id',(request,response,next) => {
    const body = request.body
    const note = {
        content: body.content,
        important: body.important,
    }
    Note.findByIdAndUpdate(request.params.id,note,{ new:true,runValidators:true,context:'query' })
        .then(result => {
            return response.json(result)
        })
        .catch(error => {
            next(error)
        })
})

route.post('/notes',(request,response,next) => {
    const body = request.body

    const note= new Note({
        content: body.content,
        important: body.important || false,

    })

    note.save()
        .then(saveNote => {
            response.json(saveNote)
        })
        .catch(error => {
            next(error)
        })

})

module.exports = route