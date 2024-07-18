const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://danielnvrrt:${password}@phonebook.zytfo17.mongodb.net/phoneBook?retryWrites=true&w=majority&appName=Phonebook`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const contactSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Contact = mongoose.model('Contact', contactSchema)

if (process.argv.length === 3) {
  console.log('phonebook:')
  Contact.find({}).then((result) => {
    result.forEach((contact) => {
      console.log(contact.name, contact.number)
    })
    mongoose.connection.close()
  })
} else if (process.argv.length === 5) {
  const name = process.argv[3]
  const number = process.argv[4]

  const contact = new Contact({
    name: name,
    number: number,
  })

  contact
    .save()
    .then((result) => {
      console.log(`Added ${contact.name} number ${contact.number} to phonebook`)
      mongoose.connection.close()
    })
    .catch((err) => {
      console.log('Error when adding the contact to the phonebook')
      mongoose.connection.close()
    })
}
