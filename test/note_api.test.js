const expect = require('chai').expect
const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Note = require('../models/note')

const initialNotes = [
    {
      content: 'HTML on helppoa',
      important: false,
    },
    {
      content: 'HTTP-protokollan tärkeimmät metodit ovat GET ja POST',
      important: true
    }
]

describe('note_api', () => {

    before(async () => {
        // Remove all documents
        await Note.remove()

        // Convert note objects to mongoose Note documents
        const noteObjects = initialNotes.map(note => new Note(note))

        // Convert Note documents to promises returned by note.save()
        const promiseArray = noteObjects.map(note => note.save())

        // Wait that all promises are resolved (i.e. all notes have been saved)
        await Promise.all(promiseArray)
    })

    it('notes are returned as json', async () => {
        await api
            .get('/api/notes')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    it('there are three notes', async () => {
        const response = await api.get('/api/notes')

        expect(response.body.length).to.equal(initialNotes.length)
    })

    it('the first note is about HTTP methods', async () => {
        const response = await api
          .get('/api/notes')

        const contents = response.body.map(r => r.content)
      
        expect(contents).to.include('HTTP-protokollan tärkeimmät metodit ovat GET ja POST')
    })

    it('note without content is not added', async () => {
        const newNote = {
            important: true
        }

        const notes = await api.get('/api/notes')

        await api.post('/api/notes')
                 .send(newNote)
                 .expect(400)

        const response = await api.get('/api/notes')

        expect(response.body.length).to.equal(initialNotes.length)
    })

    it('a valid note can be added', async () => {
        const newNote = {
            content: 'async/await yksinkertaistaa asynkronisten funktioiden kutsua',
            important: true
        }

        await api.post('/api/notes')
                 .send(newNote)
                 .expect(200)
                 .expect('Content-Type', /application\/json/)

        const response = await api.get('/api/notes')
        const contents = response.body.map(r => r.content)

        expect(response.body.length).to.equal(initialNotes.length + 1)
        expect(contents).to.include('async/await yksinkertaistaa asynkronisten funktioiden kutsua')
    })

    it('a specific note can be viewed', async () => {
        const resultAll = await api.get('/api/notes')
                                   .expect(200)
                                   .expect('Content-Type', /application\/json/)

        const noteFromAll = resultAll.body[0]

        const resultNote = await api.get(`/api/notes/${noteFromAll.id}`)
        const noteObject = resultNote.body

        expect(noteObject).to.deep.equal(noteFromAll)
    })

    it('a note can be deleted', async () => {
        const newNote = {
            content: 'HTTP DELETE poistaa resurssin',
            important: false
        }

        const addedNote = await api.post('/api/notes')
                                   .send(newNote)

        const notesAtBeginningOfOperation = await api.get('/api/notes')

        await api.delete(`/api/notes/${addedNote.body.id}`)
                 .expect(204)

        const notesAfterDelete = await api.get('/api/notes')

        const contents = notesAfterDelete.body.map(r => r.content)

        expect(contents).not.to.include('HTTP DELETE poistaa resurssin')
        expect(notesAfterDelete.body.length).to.equal(notesAtBeginningOfOperation.body.length - 1)
    })
    
    after(() => {
        server.close()
    })
})
