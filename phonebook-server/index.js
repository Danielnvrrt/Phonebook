const express = require('express')
const morgan = require('morgan')
const app = express()

morgan.token('post', function (req, res) {
  console.log(req.method)
  if (req.method === 'POST') {
    return JSON.stringify(req.body)
  }
})

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post'))

let agenda = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

const generateId = () => {
  return Math.floor(Math.random() * 99999999999999);
}

app.get('/api/persons', (request, response) => {
  response.json(agenda)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = agenda.find(p => p.id === id)
  console.log(id)
  console.log(person)
  if (person != null) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.get('/info', (request, response) => {
  response.send(
    `<p>Phonebook has info por ${agenda.length} people </p>
    <p>${new Date().toString()}</p>`
  )
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = agenda.find(p => p.id === id)

  if (person) {
    agenda = agenda.filter(p => p.id !== id)
    response.status(204).end()
  } else {
    response.status(404).end()
  }
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  } else if (agenda.find(p => p.name === body.name)) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }

  agenda = agenda.concat(person)

  response.json(person)
})


const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})