import express from 'express'
import cors from 'cors'
import errorHandler from './middleware/errorHandler.js'
import todosRouter from './routes/todos.js'
import db from './database/init.js'

const app = express()
const PORT = 3000

// Configure CORS for development (allow localhost:5173)
app.use(cors({
  origin: 'http://localhost:5173'
}))

// JSON body parsing middleware
app.use(express.json())

// Register API routes
app.use('/api/todos', todosRouter)

// Error handling middleware (must be last)
app.use(errorHandler)

// Server startup
app.listen(PORT, () => {
  console.log(`Express server running on http://localhost:${PORT}`)
})

export { app }
