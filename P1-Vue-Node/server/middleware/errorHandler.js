// Centralized error handling middleware
// Returns consistent JSON error format for all error types
const errorHandler = (err, req, res, next) => {
  // Default to 500 server error if no status code provided
  const status = err.status || err.statusCode || 500

  // Extract error message or provide default
  const message = err.message || 'Internal server error'

  // Log error details for debugging (server-side only)
  console.error('Error:', {
    status,
    message,
    stack: err.stack
  })

  // Return consistent JSON error format to client
  res.status(status).json({
    error: {
      message,
      status
    }
  })
}

export default errorHandler
