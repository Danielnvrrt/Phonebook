import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Agenda from './components/Agenda'
import agendaService from './services/agenda.service'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [valueFiltered, setValueFiltered] = useState('')
  const [personsShown, setPersonsShown] = useState([])
  const [notification, setNotificationMessage] = useState({
    message: null,
    color: null,
  })

  useEffect(() => {
    agendaService.getAllPersons().then((data) => {
      setPersons(data)
      setPersonsShown(data)
    })
  }, [])

  useEffect(() => {
    if (notification) {
      agendaService
        .getAllPersons()
        .then(initialPersons => {
          setPersons(initialPersons)
          setPersonsShown(initialPersons)
        })
    }
  }, [notification])

  const handleSubmit = (event) => {
    event.preventDefault()

    const existName = persons.find((p) => p.name === newName)
    const existNumber = persons.find((p) => p.number === newNumber)

    if (!existName && !existNumber) {
      if (newName === '') {
        alert(`Name can't be empty`)
      } else if (newNumber === '') {
        alert(`Number can't be empty`)
      } else {
        agendaService
          .saveNewPerson({ name: newName, number: newNumber })
          .then((newPerson) => {
            setNotificationMessage({
              message: `${newName} was added successfully`,
              color: 'green',
            })
            setTimeout(() => {
              setNotificationMessage({ message: null, color: null })
            }, 5000)
            setPersons(persons.concat(newPerson))
            setPersonsShown(persons.concat(newPerson))
          })
      }
    } else if (existName) {
      if (
        window.confirm(
          `${newName} is already added to the phonebook, replace the old number with ${newNumber}?`
        )
      ) {
        const updatedPerson = { ...existName, number: newNumber }
        agendaService
          .updatePerson(existName.id, updatedPerson)
          .then((updatedPerson) => {
            setNotificationMessage({
              message: `${newNumber} number was updated successfully`,
              color: 'green',
            })
            setTimeout(() => {
              setNotificationMessage({ message: null, color: null })
            }, 5000)
            const updatedPersons = persons.map((person) =>
              person.id !== updatedPerson.id ? person : updatedPerson
            )
            setPersons(updatedPersons)
            setPersonsShown(updatedPersons)
          })
          .catch(() => {
            setNotificationMessage({
              message: `Information of ${newName} has already been removed from the server`,
              color: 'red',
            })
            setTimeout(() => {
              setNotificationMessage({ message: null, color: null })
            }, 5000)
          })
      }
    } else {
      if (
        window.confirm(
          `${newNumber} number is already added to the phonebook, replace the old name with ${newName}?`
        )
      ) {
        const updatedPerson = { ...existNumber, name: newName }
        agendaService
          .updatePerson(existNumber.id, updatedPerson)
          .then((updatedPerson) => {
            setNotificationMessage({
              message: `${newName} name was updated successfully`,
              color: 'green',
            })
            setTimeout(() => {
              setNotificationMessage({ message: null, color: null })
            }, 5000)
            const updatedPersons = persons.map((person) =>
              person.id !== updatedPerson.id ? person : updatedPerson
            )
            setPersons(updatedPersons)
            setPersonsShown(updatedPersons)
          })
          .catch(() => {
            setNotificationMessage({
              message: `Information of ${newName} has already been removed from the server`,
              color: 'red',
            })
            setTimeout(() => {
              setNotificationMessage({ message: null, color: null })
            }, 5000)
          })
      }
    }
    setNewName('')
    setNewNumber('')
    setValueFiltered(valueFiltered)
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this person?')) {
      agendaService
        .deletePerson(id)
        .then(() => {
          const updatedPersons = persons.filter((person) => person.id !== id)
          setPersons(updatedPersons)
          setPersonsShown(updatedPersons)
        })
        .catch((error) => {
          setNotificationMessage({
            message: `${id} has already been removed from the server`,
            color: 'red',
          })
          setTimeout(() => {
            setNotificationMessage({ message: null, color: null })
          }, 5000)
        })
    }
  }

  const handleValueFilteredChange = (event) => {
    if (event.target.value === '') {
      setPersonsShown([...persons])
    } else {
      let pe = []
      persons.forEach((p) => {
        if (
          p.name.toLowerCase().startsWith(event.target.value.toLowerCase(), 0)
        ) {
          pe.push(p)
        }
      })
      setPersonsShown([...pe])
    }
    setValueFiltered(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification.message} color={notification.color} />
      <Filter
        filterValue={valueFiltered}
        handleValueFiltered={handleValueFilteredChange}
      />
      <h2>add a new</h2>
      <PersonForm
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
        handleSubmit={handleSubmit}
      />
      <h2>Numbers</h2>
      <Agenda personsShown={personsShown} handleDelete={handleDelete} />
    </div>
  )
}

export default App
