// Frontend service layer for API communication
// Encapsulates all HTTP requests to the backend API

const BASE_URL = '/api/todos'

// Fetch all todos from the API
export async function fetchTodos() {
  try {
    const response = await fetch(BASE_URL)

    if (!response.ok) {
      throw new Error('Failed to fetch todos')
    }

    const data = await response.json()
    return data.todos
  } catch (error) {
    console.error('Error fetching todos:', error)
    throw error
  }
}

// Create a new todo via the API
export async function createTodo(text) {
  try {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text })
    })

    if (!response.ok) {
      throw new Error('Failed to create todo')
    }

    const data = await response.json()
    return data.todo
  } catch (error) {
    console.error('Error creating todo:', error)
    throw error
  }
}

// Update a todo's completion status via the API
export async function updateTodo(id, completed) {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ completed })
    })

    if (!response.ok) {
      throw new Error('Failed to update todo')
    }

    const data = await response.json()
    return data.todo
  } catch (error) {
    console.error('Error updating todo:', error)
    throw error
  }
}

// Delete a todo via the API
export async function deleteTodo(id) {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE'
    })

    if (!response.ok) {
      throw new Error('Failed to delete todo')
    }

    return true
  } catch (error) {
    console.error('Error deleting todo:', error)
    throw error
  }
}
