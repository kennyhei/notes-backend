const notesRouter = require('express').Router()
const Note = require('../models/note')

const formatNote = (note) => {
    return {
        id: note._id,
        content: note.content,
        date: note.date,
        important: note.important,
    }
}

notesRouter.get('/', (req, res) => {
    Note.find({}, { __v: 0 })
        .then(notes => {
            res.json(notes.map(formatNote))
        })
})

notesRouter.get('/:id', (req, res) => {

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

notesRouter.delete('/:id', (req, res) => {

    Note.findByIdAndRemove(req.params.id)
        .then(result => {
            res.status(204).end()
        })
        .catch(error => {
            res.status(400).send({ error: 'malformatted id' })
        })
})

notesRouter.post('/', (req, res) => {
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

notesRouter.put('/:id', (req, res) => {
    const body = req.body

    const note = {
        content: body.content,
        important: body.important
    }

    Note.findByIdAndUpdate(req.params.id, note, { new: true })
        .then(formatNote)
        .then(updatedAndFormattedNote => {
            res.json(updatedAndFormattedNote)
        })
        .catch(error => {
            console.log(error)
            res.status(400).send({ error: 'malformatted id' })
        })
})

module.exports = notesRouter