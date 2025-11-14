import { describe, it, expect, beforeEach, vi } from 'vitest'
import { fetchTodos, createTodo, updateTodo, deleteTodo } from '../todoService.js'

describe('Todo Service Layer', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks()
  })

  it('fetchTodos() returns todos array', async () => {
    // Mock successful fetch response
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ todos: [
          { id: 1, text: 'Test todo', completed: false, created_at: Date.now() }
        ]})
      })
    )

    const todos = await fetchTodos()

    expect(fetch).toHaveBeenCalledWith('/api/todos')
    expect(todos).toHaveLength(1)
    expect(todos[0].text).toBe('Test todo')
  })

  it('createTodo(text) sends POST request and returns todo', async () => {
    const newTodo = { id: 1, text: 'New todo', completed: false, created_at: Date.now() }

    // Mock successful create response
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ todo: newTodo })
      })
    )

    const result = await createTodo('New todo')

    expect(fetch).toHaveBeenCalledWith('/api/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text: 'New todo' })
    })
    expect(result).toEqual(newTodo)
  })

  it('updateTodo(id, completed) sends PUT request', async () => {
    const updatedTodo = { id: 1, text: 'Test todo', completed: true, created_at: Date.now() }

    // Mock successful update response
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ todo: updatedTodo })
      })
    )

    const result = await updateTodo(1, true)

    expect(fetch).toHaveBeenCalledWith('/api/todos/1', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ completed: true })
    })
    expect(result.completed).toBe(true)
  })

  it('deleteTodo(id) sends DELETE request', async () => {
    // Mock successful delete response
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true
      })
    )

    const result = await deleteTodo(1)

    expect(fetch).toHaveBeenCalledWith('/api/todos/1', {
      method: 'DELETE'
    })
    expect(result).toBe(true)
  })

  it('handles errors when fetch fails', async () => {
    // Mock failed fetch response
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false
      })
    )

    await expect(fetchTodos()).rejects.toThrow('Failed to fetch todos')
  })
})
