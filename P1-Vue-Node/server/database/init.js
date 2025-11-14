import Database from 'better-sqlite3'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// Get current directory in ES module context
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Create database connection
const db = new Database(join(__dirname, 'todos.db'))

// Create todos table if it doesn't exist
const createTableSQL = `
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL,
    completed INTEGER DEFAULT 0,
    created_at INTEGER NOT NULL
  )
`

db.exec(createTableSQL)

console.log('Database initialized')

export default db
