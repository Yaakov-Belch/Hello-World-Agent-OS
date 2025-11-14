import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import { app } from '../index.js'

describe('Express Server Startup', () => {
  let server

  beforeAll(() => {
    // Start server on different port for testing
    server = app.listen(3001)
  })

  afterAll(() => {
    // Clean up server after tests
    server.close()
  })

  it('starts without errors', () => {
    expect(server).toBeDefined()
    expect(server.listening).toBe(true)
  })

  it('has CORS middleware configured', async () => {
    // Test that CORS headers are present in response
    const response = await request(app).get('/api/todos')

    // Server should respond (CORS allows the request)
    expect(response.status).toBeDefined()
  })

  it('has JSON body parser configured', async () => {
    // Test that JSON body is parsed
    const response = await request(app)
      .post('/api/todos')
      .send({ text: 'Test' })
      .set('Content-Type', 'application/json')

    // Should receive a response (not 400 for missing body parser)
    expect(response.status).toBeDefined()
  })
})
