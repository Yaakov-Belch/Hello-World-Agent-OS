import { describe, it, expect, vi } from 'vitest'
import errorHandler from '../middleware/errorHandler.js'

describe('Error Handler Middleware', () => {
  it('returns 400 for validation errors with proper JSON format', () => {
    const err = new Error('Validation failed')
    err.status = 400

    const req = {}
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    }
    const next = vi.fn()

    errorHandler(err, req, res, next)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      error: {
        message: 'Validation failed',
        status: 400
      }
    })
  })

  it('returns 404 for not found errors with proper JSON format', () => {
    const err = new Error('Resource not found')
    err.status = 404

    const req = {}
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    }
    const next = vi.fn()

    errorHandler(err, req, res, next)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({
      error: {
        message: 'Resource not found',
        status: 404
      }
    })
  })

  it('returns 500 for generic errors with proper JSON format', () => {
    const err = new Error('Something went wrong')

    const req = {}
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    }
    const next = vi.fn()

    errorHandler(err, req, res, next)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({
      error: {
        message: 'Something went wrong',
        status: 500
      }
    })
  })
})
