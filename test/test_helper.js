const Note = require('../models/note')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

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

const usersInDb = async () => {
    const users = await User.find({})
    return users
}

const createUser = async (username) => {
    const saltRounds = 10
    const passwordHash = await bcrypt.hash('secret', saltRounds)

    const user = new User({
        username,
        name: 'Kenny Heinonen',
        passwordHash,
        adult: true
    })

    return await user.save()
}

const createTokenForUser = async (id) => {
    const user = await User.findById(id)

    const userForToken = {
        username: user.username,
        id: user._id
    }

    const token = jwt.sign(userForToken, process.env.SECRET)
    return token
}

module.exports = {
    initialNotes,
    format,
    nonExistingId,
    notesInDb,
    usersInDb,
    createUser,
    createTokenForUser
}
