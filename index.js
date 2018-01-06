const http = require('http')
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

const app = express()
const middleware = require('./utils/middleware')
const config = require('./utils/config')

app.use(cors())
app.use(express.json()) // to support JSON-encoded bodies
app.use(express.static('build'))
app.use(middleware.logger)
  
mongoose.connect(config.mongoUrl)
mongoose.Promise = global.Promise

const loginRouter = require('./controllers/login')
app.use('/api/login', loginRouter)

const usersRouter = require('./controllers/users')
app.use('/api/users', usersRouter)

const notesRouter = require('./controllers/notes')
app.use('/api/notes', notesRouter)

app.use(middleware.error)

const PORT = config.port
let server = http.createServer(app)

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
  
server.on('close', () => {
    mongoose.connection.close()
})

const startServer = async () => {
    if (server._handle !== null) {
        return
    }

    await server.close()
    mongoose.connect(config.mongoUrl)
    server = http.createServer(app)
}

module.exports = {
    app, server, startServer
}