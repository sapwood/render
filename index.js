const express = require('express')
const cors = require('cors')
require('dotenv').config()
const app=express()
app.use(cors())
app.use(express.json())
app.use(express.static('dist'))



const Note = require('./models/note')






app.get('/',(request,response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes',(request,response) => {

    Note.find({}).then(notes => {
        response.json(notes)
    })

})

app.get('/api/notes/:id',(request,response,next) => {
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

app.delete('/api/notes/:id',(request,response,next) => {
    const id =request.params.id

    Note.findByIdAndDelete(id)
        .then(() => {
            response.status(204).end()
        })
        .catch(error => {
            next(error)
        })

})

app.put('/api/notes/:id',(request,response,next) => {
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
app.post('/api/notes',(request,response,next) => {
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
const unknownEndpoint = (request,response) => {
    return response.status(404).send({ error:'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler =(error,request,response) => {
    console.log(error.message)
    if (error.name==='CastError'){
        return response.status(400).send({ error:'malformatted id' })
    }
    else if(error.name==='ValidationError'){
        return response.status(400).send({ error:error.message })
    }
}
app.use(errorHandler)

const PORT = process.env.PORT

app.listen(PORT,() => {
    console.log(`Server running on port ${PORT}`)
})