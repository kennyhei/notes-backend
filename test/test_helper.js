const Note = require('../models/note')

const initialNotes = [
    {
        content: 'HTML on helppoa',
        important: false
    },
    {
        content: 'HTTP-protokollan tärkeimmät metodit ovat GET ja POST',
        important: true
    }
]

const format = (note) => {
    return {
        id: note._id,
        content: note.content,
        important: note.important
    }
}

/* 
 *  Creates and removes note from DB so we
 *  can have id that no longer exists in DB
**/
const nonExistingId = async () => {
    const note = new Note()
    await note.save()
    await note.remove()

    return note._id.toString()
}

const notesInDb = async () => {
    const notes = await Note.find({})
    return notes.map(format)
}

module.exports = {
    initialNotes,
    format,
    nonExistingId,
    notesInDb
}
