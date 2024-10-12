const express = require('express')
const cors = require('cors')
require('dotenv').config()
const app=express()
app.use(cors())
app.use(express.json())
app.use(express.static('dist'))



const Note = require('./models/note')


let notes = [
    {
      id: "1",
      content: "HTML is easy",
      important: true
    },
    {
      id: "2",
      content: "Browser can execute only JavaScript",
      important: false
    },
    {
      id: "3",
      content: "GET and POST are the most important methods of HTTP protocol",
      important: true
    }
  ]




app.get('/',(request,response)=>{
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes',(request,response)=>{

    Note.find({}).then(notes=>{
        response.json(notes)
    })
    
})

app.get('/api/notes/:id',(request,response)=>{
    const id = request.params.id
    Note.findById(id).then(note=>{
        if (note){
            response.json(note)
        }
        else{
            response.status(404).end()
        }
    })

   
})

app.delete('/api/notes/:id',(request,response)=>{
    const id =request.params.id
    
    const note = notes.find(note=>note.id===id)

    response.status(204).end()
})

app.post('/api/notes',(request,response)=>{
    const body = request.body
    if (!body.content){
        return response.status(400).json({
            error:'content missing'
        })
    }
    const note= new Note({
        content: body.content,
        important: body.important || false,
        
    })

    note.save().then(saveNote=>{
        response.json(saveNote)
    })
    
})

const PORT = process.env.PORT

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
})