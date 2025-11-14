import express from 'express'
import * as queries from '../database/queries.js'

const router = express.Router()

// GET /api/todos - Fetch all todos
router.get('/', (req, res, next) => {
  try {
    const todos = queries.getAllTodos()
    res.status(200).json({ todos })
  } catch (error) {
    next(error)
  }
})

// POST /api/todos - Create new todo
router.post('/', (req, res, next) => {
  try {
    const { text } = req.body

    // Validate: text must be non-empty string
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      const error = new Error('Todo text cannot be empty')
      error.status = 400
      throw error
    }

    // Create todo in database
    const newTodo = queries.createTodo(text.trim())

    res.status(201).json({ todo: newTodo })
  } catch (error) {
    next(error)
  }
})

// PUT /api/todos/:id - Update todo completion status
router.put('/:id', (req, res, next) => {
  try {
    const id = parseInt(req.params.id)
    const { completed } = req.body

    // Validate: completed must be boolean
    if (typeof completed !== 'boolean') {
      const error = new Error('Completed must be a boolean value')
      error.status = 400
      throw error
    }

    // Update todo in database
    const updatedTodo = queries.updateTodoCompleted(id, completed)

    if (!updatedTodo) {
      const error = new Error('Todo not found')
      error.status = 404
      throw error
    }

    res.status(200).json({ todo: updatedTodo })
  } catch (error) {
    next(error)
  }
})

// DELETE /api/todos/:id - Delete todo
router.delete('/:id', (req, res, next) => {
  try {
    const id = parseInt(req.params.id)

    // Delete todo from database
    const changes = queries.deleteTodo(id)

    if (changes === 0) {
      const error = new Error('Todo not found')
      error.status = 404
      throw error
    }

    res.status(200).json({ message: 'Todo deleted successfully' })
  } catch (error) {
    next(error)
  }
})

export default router
