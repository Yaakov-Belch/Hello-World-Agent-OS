import db from './init.js'

// Helper function to convert completed from INTEGER (0/1) to boolean
const convertTodoFromDb = (todo) => {
  if (!todo) return null
  return {
    ...todo,
    completed: Boolean(todo.completed)
  }
}

// Get all todos from database
export function getAllTodos() {
  const sql = 'SELECT * FROM todos ORDER BY created_at DESC'
  const todos = db.prepare(sql).all()
  return todos.map(convertTodoFromDb)
}

// Get a single todo by id
export function getTodoById(id) {
  const sql = 'SELECT * FROM todos WHERE id = ?'
  const todo = db.prepare(sql).get(id)
  return convertTodoFromDb(todo)
}

// Create a new todo
export function createTodo(text) {
  const sql = 'INSERT INTO todos (text, completed, created_at) VALUES (?, 0, ?)'
  const result = db.prepare(sql).run(text, Date.now())

  // Fetch and return the created todo
  return getTodoById(result.lastInsertRowid)
}

// Update a todo's completion status
export function updateTodoCompleted(id, completed) {
  const completedInt = completed ? 1 : 0
  const sql = 'UPDATE todos SET completed = ? WHERE id = ?'
  db.prepare(sql).run(completedInt, id)

  // Fetch and return the updated todo
  return getTodoById(id)
}

// Delete a todo
export function deleteTodo(id) {
  const sql = 'DELETE FROM todos WHERE id = ?'
  const result = db.prepare(sql).run(id)

  // Return number of changes (0 or 1)
  return result.changes
}
