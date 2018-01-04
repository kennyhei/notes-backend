const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const middleware = require('./utils/middleware')

app.use(cors())
app.use(express.json()) // to support JSON-encoded bodies
app.use(express.static('build'))
app.use(middleware.logger)

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
  
const mongoUrl = process.env.MONGODB_URI
mongoose.connect(mongoUrl)
mongoose.Promise = global.Promise

const notesRouter = require('./controllers/notes')
app.use('/api/notes', notesRouter)

app.use(middleware.error)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)    
})