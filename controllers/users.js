const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

const formatUser = (user) => {
    return {
        id: user._id,
        username: user.username,
        name: user.name,
        notes: user.notes
    }
}

usersRouter.get('/', async (request, response) => {
    // Populaten parametri määrittelee, että user-dokumenttien
    // notes-kentässä olevat note-olioihin viittaavat id:t
    // korvataan niitä vastaavilla dokumenteilla.
    const users = await User
        .find({})
        .populate('notes', { content: 1, date: 1 })

    response.json(users.map(formatUser))
})

usersRouter.post('/', async (request, response) => {

    try {
        const body = request.body

        const existingUser = await User.find({ username: body.username })
        if (existingUser.length > 0) {
            return response.status(400).json({ error: 'username must be unique' })
        }

        const saltRounds = 10
        const passwordHash = await bcrypt.hash(body.password, saltRounds)
    
        const user = new User({
            username: body.username,
            name: body.name,
            passwordHash
        })
    
        const savedUser = await user.save()
        response.json(savedUser)

    } catch (error) {
        console.log(error)
        response.status(500).json({ error: 'something whent wrong...' })
    }
})

module.exports = usersRouter