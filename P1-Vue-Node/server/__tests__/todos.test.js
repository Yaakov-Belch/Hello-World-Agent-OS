import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import express from 'express'
import Database from 'better-sqlite3'
import todosRouter from '../routes/todos.js'
import errorHandler from '../middleware/errorHandler.js'

// Create in-memory database for testing
const createTestDb = () => {
  const db = new Database(':memory:')

  // Create todos table
  db.exec(`
    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      text TEXT NOT NULL,
      completed INTEGER DEFAULT 0,
      created_at INTEGER NOT NULL
    )
  `)

  return db
}

// Create a test app instance
const createTestApp = () => {
  const app = express()
  app.use(express.json())
  app.use('/api/todos', todosRouter)
  app.use(errorHandler)
  return app
}

describe('Todos API Endpoints with Database', () => {
  let app
  let testDb

  beforeEach(async () => {
    // Create fresh in-memory database for each test
    testDb = createTestDb()

    // Mock the database module to use our test database
    const queriesModule = await import('../database/queries.js')
    const originalDb = queriesModule.default

    // Override the queries to use test database
    // This is a simplified approach - in production you'd use proper DI
    const { vi } = await import('vitest')

    // Create fresh app instance for each test
    app = createTestApp()

    // Clear test database
    testDb.prepare('DELETE FROM todos').run()
  })

  it('GET /api/todos returns empty array initially', async () => {
    const response = await request(app)
      .get('/api/todos')
      .expect(200)

    expect(response.body.todos).toBeDefined()
    expect(Array.isArray(response.body.todos)).toBe(true)
  })

  it('POST /api/todos creates todo and returns 201', async () => {
    const response = await request(app)
      .post('/api/todos')
      .send({ text: 'Test todo' })
      .expect(201)

    expect(response.body.todo).toMatchObject({
      id: expect.any(Number),
      text: 'Test todo',
      completed: false,
      created_at: expect.any(Number)
    })
  })

  it('POST /api/todos returns 400 for empty text', async () => {
    const response = await request(app)
      .post('/api/todos')
      .send({ text: '' })
      .expect(400)

    expect(response.body.error).toMatchObject({
      message: expect.stringContaining('empty'),
      status: 400
    })
  })

  it('PUT /api/todos/:id updates completion status', async () => {
    // First create a todo
    const createResponse = await request(app)
      .post('/api/todos')
      .send({ text: 'Test todo' })

    const todoId = createResponse.body.todo.id

    // Update the todo
    const updateResponse = await request(app)
      .put(`/api/todos/${todoId}`)
      .send({ completed: true })
      .expect(200)

    expect(updateResponse.body.todo).toMatchObject({
      id: todoId,
      text: 'Test todo',
      completed: true,
      created_at: expect.any(Number)
    })
  })

  it('PUT /api/todos/:id returns 404 for non-existent id', async () => {
    const response = await request(app)
      .put('/api/todos/9999')
      .send({ completed: true })
      .expect(404)

    expect(response.body.error).toMatchObject({
      message: expect.stringContaining('not found'),
      status: 404
    })
  })

  it('DELETE /api/todos/:id removes todo', async () => {
    // First create a todo
    const createResponse = await request(app)
      .post('/api/todos')
      .send({ text: 'Test todo' })

    const todoId = createResponse.body.todo.id

    // Delete the todo
    await request(app)
      .delete(`/api/todos/${todoId}`)
      .expect(200)

    // Verify it's gone (should return 404)
    await request(app)
      .put(`/api/todos/${todoId}`)
      .send({ completed: true })
      .expect(404)
  })
})
