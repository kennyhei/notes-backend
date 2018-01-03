const mongoose = require('mongoose')

if (process.env.NODE_ENV !== 'production') {
    let envPath = __dirname.split('\\')
    envPath.pop()
    envPath = envPath.join('\\') + '\\.env'

    require('dotenv').config({ path: envPath })
}
  
const url = process.env.MONGODB_URI

console.log(url)

mongoose.connect(url).then(result => {
    console.log(result)
})
.catch(error => {
    console.log(error)
})
mongoose.Promise = global.Promise

const Note = mongoose.model('Note', {
    content: String,
    date: Date,
    important: Boolean
})

const note = new Note({
    content: 'Rakastan muistiinpanoja',
    date: new Date(),
    important: true
})

note.save().then(result => {
    console.log(result)
    console.log('note saved')
    mongoose.connection.close()
})

/*Note.find({ important: true }).then(result => {
    result.forEach(note => {
        console.log(note)
    })
    mongoose.connection.close()
})*/