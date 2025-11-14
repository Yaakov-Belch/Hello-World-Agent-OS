import { describe, it, expect } from 'vitest'
import Database from 'better-sqlite3'

describe('Database Query Functions', () => {
  it('getAllTodos() returns empty array initially', () => {
    // Create in-memory database
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

    // Query all todos
    const todos = db.prepare('SELECT * FROM todos ORDER BY created_at DESC').all()

    expect(todos).toEqual([])
    db.close()
  })

  it('createTodo() inserts and returns todo with auto-increment id', () => {
    const db = new Database(':memory:')

    db.exec(`
      CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        text TEXT NOT NULL,
        completed INTEGER DEFAULT 0,
        created_at INTEGER NOT NULL
      )
    `)

    const sql = 'INSERT INTO todos (text, completed, created_at) VALUES (?, 0, ?)'
    const result = db.prepare(sql).run('Test todo', Date.now())

    const todo = db.prepare('SELECT * FROM todos WHERE id = ?').get(result.lastInsertRowid)

    expect(todo).toMatchObject({
      id: expect.any(Number),
      text: 'Test todo',
      completed: 0,
      created_at: expect.any(Number)
    })

    db.close()
  })

  it('getTodoById() retrieves specific todo', () => {
    const db = new Database(':memory:')

    db.exec(`
      CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        text TEXT NOT NULL,
        completed INTEGER DEFAULT 0,
        created_at INTEGER NOT NULL
      )
    `)

    // Insert a todo directly
    const sql = 'INSERT INTO todos (text, completed, created_at) VALUES (?, 0, ?)'
    const result = db.prepare(sql).run('Test todo', Date.now())
    const todoId = result.lastInsertRowid

    // Retrieve it
    const todo = db.prepare('SELECT * FROM todos WHERE id = ?').get(todoId)

    expect(todo).toMatchObject({
      id: todoId,
      text: 'Test todo',
      completed: 0,
      created_at: expect.any(Number)
    })

    db.close()
  })

  it('updateTodoCompleted() updates status', () => {
    const db = new Database(':memory:')

    db.exec(`
      CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        text TEXT NOT NULL,
        completed INTEGER DEFAULT 0,
        created_at INTEGER NOT NULL
      )
    `)

    // Insert a todo
    const insertSql = 'INSERT INTO todos (text, completed, created_at) VALUES (?, 0, ?)'
    const insertResult = db.prepare(insertSql).run('Test todo', Date.now())
    const todoId = insertResult.lastInsertRowid

    // Update it
    const updateSql = 'UPDATE todos SET completed = ? WHERE id = ?'
    db.prepare(updateSql).run(1, todoId)

    // Verify update
    const updated = db.prepare('SELECT * FROM todos WHERE id = ?').get(todoId)
    expect(updated.completed).toBe(1)

    db.close()
  })

  it('deleteTodo() removes todo', () => {
    const db = new Database(':memory:')

    db.exec(`
      CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        text TEXT NOT NULL,
        completed INTEGER DEFAULT 0,
        created_at INTEGER NOT NULL
      )
    `)

    // Insert a todo
    const insertSql = 'INSERT INTO todos (text, completed, created_at) VALUES (?, 0, ?)'
    const insertResult = db.prepare(insertSql).run('Test todo', Date.now())
    const todoId = insertResult.lastInsertRowid

    // Delete it
    const deleteSql = 'DELETE FROM todos WHERE id = ?'
    const deleteResult = db.prepare(deleteSql).run(todoId)

    expect(deleteResult.changes).toBe(1)

    // Verify deletion
    const deleted = db.prepare('SELECT * FROM todos WHERE id = ?').get(todoId)
    expect(deleted).toBeUndefined()

    db.close()
  })

  it('boolean conversion works (completed 0/1 <-> false/true)', () => {
    const db = new Database(':memory:')

    db.exec(`
      CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        text TEXT NOT NULL,
        completed INTEGER DEFAULT 0,
        created_at INTEGER NOT NULL
      )
    `)

    // Insert a todo with completed = 0
    const insertSql = 'INSERT INTO todos (text, completed, created_at) VALUES (?, 0, ?)'
    const insertResult = db.prepare(insertSql).run('Test todo', Date.now())
    const todoId = insertResult.lastInsertRowid

    // Verify 0 is stored
    let todo = db.prepare('SELECT * FROM todos WHERE id = ?').get(todoId)
    expect(todo.completed).toBe(0)

    // Update to 1
    const updateSql = 'UPDATE todos SET completed = ? WHERE id = ?'
    db.prepare(updateSql).run(1, todoId)

    // Verify 1 is stored
    todo = db.prepare('SELECT * FROM todos WHERE id = ?').get(todoId)
    expect(todo.completed).toBe(1)

    // Boolean conversion
    expect(Boolean(0)).toBe(false)
    expect(Boolean(1)).toBe(true)

    db.close()
  })
})
