const express = require('express')
const cors = require('cors')
const app = express()

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
]

app.get('/', (req, res) => {
    res.send('<h1>Hello world!</h1>')
})

app.get('/notes', (req, res) => {
    res.json(notes)
})

app.get('/notes/:id', (req, res) => {
    const id = Number(req.params.id)
    const note = notes.find(note => note.id === id)

    if (note) {
        res.json(note)
    } else {
        res.status(404).end()
    }
})

app.delete('/notes/:id', (req, res) => {
    const id = Number(req.params.id)
    notes = notes.filter(note => note.id !== id)

    res.status(204).end()
})

app.post('/notes', (req, res) => {
    const body = req.body

    if (body.content === undefined) {
        res.status(400).json({ error: 'content missing' })
        return
    }

    const note = {
        content: body.content,
        important: body.important || false,
        date: body.date || new Date(),
        id: generateId()
    }

    notes.push(note)
    res.json(note)
})

app.use(error)

const generateId = () => {
    const maxId = notes.length > 0 ? notes.map(n => n.id).sort().pop() : 0
    return maxId + 1
}

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)    
})