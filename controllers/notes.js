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

notesRouter.get('/', async (req, res) => {
    const notes = await Note.find({}, { __v: 0 })
    res.json(notes.map(formatNote))
})

notesRouter.get('/:id', async (req, res) => {

    try {
        const note = await Note.findById(req.params.id)

        if (note) {
            res.json(formatNote(note))
        } else {
            res.status(404).end()
        }

    } catch (error) {
        console.log(error)
        res.status(400).send({ error: 'malformatted id' })
    }
})

notesRouter.delete('/:id', async (req, res) => {

    try {
        await Note.findByIdAndRemove(req.params.id)
        res.status(204).end()
    } catch (error) {
        res.status(400).send({ error: 'malformatted id' })
    }
})

notesRouter.post('/', async (req, res) => {
    const body = req.body

    if (body.content === undefined) {
        return res.status(400).json({ error: 'content missing' })
    }

    const note = new Note({
        content: body.content,
        important: body.important || false,
        date: body.date || new Date()
    })

    try {
        const savedNote = await note.save()
        res.json(formatNote(savedNote))
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'something whent wrong...' })
    }
})

notesRouter.put('/:id', async (req, res) => {
    const body = req.body

    const note = {
        content: body.content,
        important: body.important
    }

    try {
        const updatedNote = await Note.findByIdAndUpdate(req.params.id, note, { new: true })
        res.json(formatNote(updatedNote))
    } catch (error) {
        console.log(error)
        res.status(400).send({ error: 'malformatted id' })
    }
})

module.exports = notesRouter