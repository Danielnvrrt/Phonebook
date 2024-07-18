import axios from 'axios'
const baseURL = 'http://localhost:3001/api/persons'

const getAllPersons = () => {
  try {
    const request = axios.get(baseURL)
    return request.then((response) => response.data)
  } catch (error) {
    console.error('Error fetching persons:', error)
    throw error
  }
}

const saveNewPerson = (newPerson) => {
  try {
    const request = axios.post(baseURL, newPerson)
    return request.then((response) => response.data)
  } catch (error) {
    console.error('Error saving new person:', error)
    throw error
  }
}

const updatePerson = (id, updatedPerson) => {
  try {
    const request = axios.put(`${baseURL}/${id}`, updatedPerson)
    return request.then((response) => response.data)
  } catch (error) {
    console.error('Error updating person:', error)
    throw error
  }
}

const deletePerson = (id) => {
  try {
    const request = axios.delete(`${baseURL}/${id}`)
    return request.then((response) => response.data)
  } catch (error) {
    console.error('Error deleting person:', error)
    throw error
  }
}

export default {
  getAllPersons,
  saveNewPerson,
  updatePerson,
  deletePerson,
}
