const supertest = require('supertest')
const { app, server, startServer } = require('../index')
const api = supertest(app)
const Note = require('../models/note')
const { initialNotes, nonExistingId, notesInDb, createUser, createTokenForUser } = require('./test_helper')

describe('when there is initially some notes saved', () => {

    let token
    let user

    beforeAll(async () => {
        //startServer()

        // Remove all documents
        await Note.remove()

        // Convert note objects to mongoose Note documents
        const noteObjects = initialNotes.map(note => new Note(note))

        // Convert Note documents to promises returned by note.save()
        const promiseArray = noteObjects.map(note => note.save())

        // Wait that all promises are resolved (i.e. all notes have been saved)
        await Promise.all(promiseArray)

        user = await createUser('kennyhei')
        token = await createTokenForUser(user._id)
    })

    test('all notes are returned as json by GET /api/notes', async () => {
        const notesInDatabase = await notesInDb()

        const response = await api
            .get('/api/notes')
            .expect(200)
            .expect('Content-Type', /application\/json/)

        expect(response.body.length).toBe(notesInDatabase.length)

        const returnedContents = response.body.map(n => n.content)
        notesInDatabase.forEach(note => {
            expect(returnedContents).toContain(note.content)
        })
    })

    test('individual notes are returned as json by GET /api/notes/:id', async () => {
        const notesInDatabase = await notesInDb()
        const aNote = notesInDatabase[0]
    
        const response = await api
            .get(`/api/notes/${aNote.id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)
    
        expect(response.body.content).toBe(aNote.content)
    })

    test('404 returned by GET /api/notes/:id with nonexisting valid id', async () => {
        const validNonexistingId = await nonExistingId()
    
        await api
            .get(`/api/notes/${validNonexistingId}`)
            .expect(404)
    })

    test('400 is returned by GET /api/notes/:id with invalid id', async () => {
        const invalidId = '5a3d5da59070081a82a3445'
    
        await api
            .get(`/api/notes/${invalidId}`)
            .expect(400)
    })

    describe('addition of a new note', async () => {

        test('POST /api/blogs fails if user has not authenticated', async () => {
            const notesAtBeginningOfOperation = await notesInDb()

            const newNote = {
                content: 'async/await yksinkertaistaa asynkronisten funktioiden kutsua',
                important: true
            }

            const result = await api
                .post('/api/notes')
                .send(newNote)
                .expect(401)

            expect(result.body).toEqual({ error: 'token missing or invalid' })

            const notesAfterOperation = await notesInDb()
            expect(notesAfterOperation.length).toBe(notesAtBeginningOfOperation.length)

            const contents = notesAfterOperation.map(r => r.content)
            expect(contents).not.toContain('async/await yksinkertaistaa asynkronisten funktioiden kutsua')
        })

        test('POST /api/notes fails with proper status code if content is missing', async () => {
            const newNote = {
                important: true
            }
      
            const notesAtBeginningOfOperation = await notesInDb()
      
            const result = await api
                .post('/api/notes')
                .set('Authorization', `bearer ${token}`)
                .send(newNote)
                .expect(400)

            expect(result.body).toEqual({ error: 'content missing' })
      
            const notesAfterOperation = await notesInDb()
            expect(notesAfterOperation.length).toBe(notesAtBeginningOfOperation.length)
        })

        test('POST /api/notes succeeds with valid data', async () => {
            const notesAtBeginningOfOperation = await notesInDb()

            const newNote = {
                content: 'async/await yksinkertaistaa asynkronisten funktioiden kutsua',
                important: true
            }

            await api
                .post('/api/notes')
                .set('Authorization', `bearer ${token}`)
                .send(newNote)
                .expect(200)
                .expect('Content-Type', /application\/json/)

            const notesAfterOperation = await notesInDb()

            expect(notesAfterOperation.length).toBe(notesAtBeginningOfOperation.length + 1)

            const contents = notesAfterOperation.map(r => r.content)
            expect(contents).toContain('async/await yksinkertaistaa asynkronisten funktioiden kutsua')
        })

    })

    describe('deletion of a note', async () => {
        let addedNote
        /*let otherToken*/

        beforeAll(async () => {
            addedNote = new Note({
                content: 'poisto pyynnöllä HTTP DELETE',
                important: false
            })

            await addedNote.save()

            const otherUser = await createUser('mluukkai')
            await createTokenForUser(otherUser._id)
        })

        test('DELETE /api/notes/:id succeeds with proper status code', async () => {
            const notesAtBeginningOfOperation = await notesInDb()
      
            await api
                .delete(`/api/notes/${addedNote._id}`)
                .set('Authorization', `bearer ${token}`)
                .expect(204)
      
            const notesAfterOperation = await notesInDb()
      
            const contents = notesAfterOperation.map(r => r.content)
      
            expect(contents).not.toContain(addedNote.content)
            expect(notesAfterOperation.length).toBe(notesAtBeginningOfOperation.length - 1)
        })
      
    })
    
    afterAll(() => {
        server.close()
    })
})
