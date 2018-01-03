const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors')
const app = express()
const Note = require('./models/Note')

const logger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}

const error = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(express.static('build'))
app.use(cors())
app.use(express.json()) // to support JSON-encoded bodies
app.use(logger)

const formatNote = (note) => {
    return {
        id: note._id,
        content: note.content,
        date: note.date,
        important: note.important,
    }
}

app.get('/', (req, res) => {
    res.send('<h1>Hello world!</h1>')
})

app.get('/api/notes', (req, res) => {
    Note.find({}, { __v: 0 }).then(notes => {
        res.json(notes.map(formatNote))
    })
})

app.get('/api/notes/:id', (req, res) => {

    Note.findById(req.params.id).then(note => {
        if (note) {
            res.json(formatNote(note))
        } else {
            res.status(404).end()
        }
    })
    .catch(error => {
        console.log(error)
        res.status(400).send({ error: 'malformatted id' })
    })
})

app.delete('/api/notes/:id', (req, res) => {

    Note.findByIdAndRemove(req.params.id)
        .then(result => {
            res.status(204).end()
        })
        .catch(error => {
            res.status(400).send({ error: 'malformatted id' })
        })
})

app.post('/api/notes', (req, res) => {
    const body = req.body

    if (body.content === undefined) {
        res.status(400).json({ error: 'content missing' })
        return
    }

    const note = new Note({
        content: body.content,
        important: body.important || false,
        date: body.date || new Date()
    })

    note.save()
        .then(formatNote)
        .then(savedAndFormattedNote => {
            res.json(savedAndFormattedNote)
        })
})

app.put('/api/notes/:id', (req, res) => {
    const body = req.body

    const note = {
        content: body.content,
        important: body.important
    }

    Note.findByIdAndUpdate(req.params.id, note, { new: true} )
        .then(formatNote)
        .then(updatedAndFormattedNote => {
            res.json(updatedAndFormattedNote)
        })
        .catch(error => {
            console.log(error)
            res.status(400).send({ error: 'malformatted id' })
        })
})

app.use(error)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)    
})

/* EXAMPLE DATA WE USED BEFORE MONGODB

let notes = [
    {
      id: 1,
      content: 'HTML on helppoa',
      date: '2017-12-10T17:30:31.098Z',
      important: true
    },
    {
      id: 2,
      content: 'Selain pystyy suorittamaan vain javascriptiä',
      date: '2017-12-10T18:39:34.091Z',
      important: false
    },
    {
      id: 3,
      content: 'HTTP-protokollan tärkeimmät metodit ovat GET ja POST',
      date: '2017-12-10T19:20:14.298Z',
      important: true
    }
]*/