const mongoose = require('mongoose')

const url = 'mongodb://heroku_nzqmcb5c:6jos0k8mb222gi3hhl9osbl8bn@ds237707.mlab.com:37707/heroku_nzqmcb5c'

mongoose.connect(url)
mongoose.Promise = global.Promise

const Note = mongoose.model('Note', {
    content: String,
    date: Date,
    important: Boolean
})

/*const note = new Note({
    content: 'HTTP-protokollan tärkeimmät metodit ovat GET ja POST',
    date: new Date(),
    important: true
})

note.save().then(result => {
    console.log(result)
    console.log('note saved')
    mongoose.connection.close()
})*/

Note.find({ important: true }).then(result => {
    result.forEach(note => {
        console.log(note)
    })
    mongoose.connection.close()
})