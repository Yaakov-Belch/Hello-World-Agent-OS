# Task Breakdown: Full-Stack Todo Application Backend and Integration

## Overview
Total Tasks: 4 Phase Groups
Progressive Implementation: In-Memory Backend → Frontend Integration → Database Setup → Database Integration

## Task List

### Phase 1: Express Server with In-Memory Storage

#### Task Group 1.1: Server Foundation
**Dependencies:** None
**Assigned to:** Backend Engineer

- [x] 1.1.0 Complete Express server foundation with in-memory storage
  - [x] 1.1.1 Install backend dependencies
    - Run: `npm install express cors`
    - Run: `npm install --save-dev nodemon`
    - Verify: Check package.json dependencies section
  - [x] 1.1.2 Create server entry point at `/server/index.js`
    - Import express and cors
    - Configure CORS for development (allow localhost:5173)
    - Add JSON body parsing middleware: `app.use(express.json())`
    - Set server port to 3000
    - Add server startup listener with console log
    - Reference: Express standard patterns from standards/backend/api.md
  - [x] 1.1.3 Create in-memory storage structure
    - Initialize empty todos array at module level in `/server/index.js`
    - Add idCounter variable starting at 1 for auto-increment simulation
    - Structure: `let todos = []` and `let idCounter = 1`
  - [x] 1.1.4 Add npm scripts to package.json
    - Add: `"dev:server": "nodemon server/index.js"`
    - Test: Run `npm run dev:server` and verify server starts on port 3000
  - [x] 1.1.5 Write 3 focused smoke tests for server startup
    - Create `/server/__tests__/server.test.js`
    - Test 1: Server starts without errors
    - Test 2: CORS middleware is configured
    - Test 3: JSON body parser is configured
    - Use Vitest with `describe()` and `it()` blocks
    - Reference: Test patterns from `/src/components/__tests__/TodoForm.spec.js`

**Acceptance Criteria:**
- Server starts on port 3000 without errors
- CORS configured for localhost:5173
- JSON body parsing enabled
- npm script `dev:server` works
- 3 smoke tests pass

---

#### Task Group 1.2: Error Handling Middleware
**Dependencies:** Task Group 1.1
**Assigned to:** Backend Engineer

- [x] 1.2.0 Complete error handling middleware
  - [x] 1.2.1 Create error handler at `/server/middleware/errorHandler.js`
    - Export error middleware function: `(err, req, res, next) => {}`
    - Handle validation errors (status 400)
    - Handle not found errors (status 404)
    - Handle generic server errors (status 500)
    - Return consistent JSON format: `{ error: { message: string, status: number } }`
    - Reference: standards/global/error-handling.md for user-friendly messages
  - [x] 1.2.2 Register error handler in `/server/index.js`
    - Import errorHandler from `/server/middleware/errorHandler.js`
    - Add as last middleware: `app.use(errorHandler)`
    - Place after all routes
  - [x] 1.2.3 Write 3 focused tests for error handling
    - Add to `/server/__tests__/errorHandler.test.js`
    - Test 1: Returns 400 for validation errors with proper JSON format
    - Test 2: Returns 404 for not found errors with proper JSON format
    - Test 3: Returns 500 for generic errors with proper JSON format
    - Mock error scenarios
  - [x] 1.2.4 Run error handler tests
    - Execute: `npm test server/__tests__/errorHandler.test.js`
    - Verify all 3 tests pass

**Acceptance Criteria:**
- Error middleware handles 400, 404, 500 status codes
- Consistent JSON error format returned
- Error handler registered in server
- 3 error handling tests pass

---

#### Task Group 1.3: REST API Endpoints (In-Memory)
**Dependencies:** Task Group 1.2
**Assigned to:** Backend Engineer

- [x] 1.3.0 Complete REST API endpoints with in-memory storage
  - [x] 1.3.1 Create routes file at `/server/routes/todos.js`
    - Import express and create router: `const router = express.Router()`
    - Export router at end of file
    - Add access to in-memory todos array and idCounter (pass as params or use module-level)
  - [x] 1.3.2 Implement GET /api/todos endpoint
    - Route: `router.get('/', (req, res) => {})`
    - Return all todos from in-memory array
    - Status: 200
    - Response format: `{ todos: [...] }`
  - [x] 1.3.3 Implement POST /api/todos endpoint
    - Route: `router.post('/', (req, res) => {})`
    - Extract text from request body: `const { text } = req.body`
    - Validate: text must be non-empty string (reference TodoForm.vue validation pattern from line 46)
    - Create new todo: `{ id: idCounter++, text, completed: false, created_at: Date.now() }`
    - Push to in-memory array
    - Status: 201
    - Response format: `{ todo: {...} }`
    - Throw validation error if text is empty
  - [x] 1.3.4 Implement PUT /api/todos/:id endpoint
    - Route: `router.put('/:id', (req, res) => {})`
    - Extract id from params: `const id = parseInt(req.params.id)`
    - Extract completed from body: `const { completed } = req.body`
    - Validate: completed must be boolean
    - Find todo by id in array
    - If not found, throw 404 error
    - Update completed status
    - Status: 200
    - Response format: `{ todo: {...} }`
  - [x] 1.3.5 Implement DELETE /api/todos/:id endpoint
    - Route: `router.delete('/:id', (req, res) => {})`
    - Extract id from params: `const id = parseInt(req.params.id)`
    - Find index of todo in array
    - If not found, throw 404 error
    - Remove from array using splice or filter
    - Status: 200
    - Response format: `{ message: 'Todo deleted successfully' }`
  - [x] 1.3.6 Register routes in `/server/index.js`
    - Import todos router: `const todosRouter = require('./routes/todos')`
    - Mount routes: `app.use('/api/todos', todosRouter)`
    - Place before error handler middleware
  - [x] 1.3.7 Write 6 focused tests for API endpoints
    - Create `/server/__tests__/todos.test.js`
    - Test 1: GET /api/todos returns empty array initially
    - Test 2: POST /api/todos creates todo and returns 201
    - Test 3: POST /api/todos returns 400 for empty text
    - Test 4: PUT /api/todos/:id updates completion status
    - Test 5: PUT /api/todos/:id returns 404 for non-existent id
    - Test 6: DELETE /api/todos/:id removes todo
    - Use supertest or manual fetch for HTTP testing
    - Mock in-memory storage between tests
  - [x] 1.3.8 Run Phase 1 API tests
    - Execute: `npm test server/__tests__/todos.test.js`
    - Verify all 6 API endpoint tests pass

**Acceptance Criteria:**
- All 4 REST endpoints (GET, POST, PUT, DELETE) implemented
- Proper HTTP status codes returned (200, 201, 400, 404)
- Validation errors thrown for invalid input
- In-memory storage working correctly
- 6 API endpoint tests pass

---

#### Task Group 1.4: Phase 1 Manual Testing & Checkpoint
**Dependencies:** Task Group 1.3
**Assigned to:** Backend Engineer

- [x] 1.4.0 Complete Phase 1 manual testing and verification
  - [x] 1.4.1 Start server and test with curl/Postman
    - Run: `npm run dev:server`
    - Test GET: `curl http://localhost:3000/api/todos`
    - Test POST: `curl -X POST http://localhost:3000/api/todos -H "Content-Type: application/json" -d '{"text":"Test todo"}'`
    - Test PUT: `curl -X PUT http://localhost:3000/api/todos/1 -H "Content-Type: application/json" -d '{"completed":true}'`
    - Test DELETE: `curl -X DELETE http://localhost:3000/api/todos/1`
    - Verify responses match expected formats
  - [x] 1.4.2 Run all Phase 1 tests
    - Execute: `npm test server/`
    - Verify all tests pass (approximately 12 tests total: 3 smoke + 3 error + 6 API)
  - [x] 1.4.3 Verify Phase 1 completion checklist
    - Confirm: Express server running on port 3000
    - Confirm: All 4 REST endpoints working
    - Confirm: In-memory storage functional
    - Confirm: Error handling working
    - Confirm: All Phase 1 tests passing

**Acceptance Criteria:**
- Manual curl/Postman tests successful for all endpoints
- All Phase 1 tests pass (approximately 12 tests)
- Server runs without errors
- Ready to proceed to Phase 2

---

### Phase 2: Frontend Integration with API

#### Task Group 2.1: Development Environment Setup
**Dependencies:** Phase 1 Complete
**Assigned to:** Full-Stack Engineer

- [x] 2.1.0 Complete development environment configuration
  - [x] 2.1.1 Install concurrently for running both servers
    - Run: `npm install --save-dev concurrently`
    - Verify: Check package.json devDependencies
  - [x] 2.1.2 Add concurrent npm scripts to package.json
    - Update: `"dev:client": "vite"`
    - Add: `"dev": "concurrently \"npm run dev:server\" \"npm run dev:client\""`
    - Test: Run `npm run dev` and verify both servers start
  - [x] 2.1.3 Configure Vite proxy in `vite.config.js`
    - Add proxy configuration to server object:
    ```javascript
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true
        }
      }
    }
    ```
    - Reference: Existing vite.config.js structure (lines 6-9 for test config)
  - [x] 2.1.4 Test proxy configuration
    - Run: `npm run dev`
    - Open browser: http://localhost:5173
    - Open console and test: `fetch('/api/todos').then(r => r.json()).then(console.log)`
    - Verify: Returns todos array from backend

**Acceptance Criteria:**
- Concurrently package installed
- npm script `dev` runs both servers simultaneously
- Vite proxy forwards /api requests to Express
- Proxy configuration tested and working

---

#### Task Group 2.2: Frontend Service Layer
**Dependencies:** Task Group 2.1
**Assigned to:** Frontend Engineer

- [x] 2.2.0 Complete frontend service layer for API communication
  - [x] 2.2.1 Create service file at `/src/services/todoService.js`
    - Create file with base structure
    - Define base URL constant: `const BASE_URL = '/api/todos'`
  - [x] 2.2.2 Implement fetchTodos() function
    - Export async function: `export async function fetchTodos()`
    - Use fetch API: `const response = await fetch(BASE_URL)`
    - Check response.ok, throw error if false
    - Parse JSON: `const data = await response.json()`
    - Return todos array: `return data.todos`
    - Wrap in try-catch for error handling
  - [x] 2.2.3 Implement createTodo(text) function
    - Export async function: `export async function createTodo(text)`
    - Use fetch with POST method
    - Headers: `{ 'Content-Type': 'application/json' }`
    - Body: `JSON.stringify({ text })`
    - Return created todo from response: `return data.todo`
    - Wrap in try-catch for error handling
  - [x] 2.2.4 Implement updateTodo(id, completed) function
    - Export async function: `export async function updateTodo(id, completed)`
    - Use fetch with PUT method to `${BASE_URL}/${id}`
    - Body: `JSON.stringify({ completed })`
    - Return updated todo from response: `return data.todo`
    - Wrap in try-catch for error handling
  - [x] 2.2.5 Implement deleteTodo(id) function
    - Export async function: `export async function deleteTodo(id)`
    - Use fetch with DELETE method to `${BASE_URL}/${id}`
    - Check response.ok, throw error if false
    - Return success message or void
    - Wrap in try-catch for error handling
  - [x] 2.2.6 Write 5 focused tests for service layer
    - Create `/src/services/__tests__/todoService.test.js`
    - Test 1: fetchTodos() returns todos array
    - Test 2: createTodo(text) sends POST request and returns todo
    - Test 3: updateTodo(id, completed) sends PUT request
    - Test 4: deleteTodo(id) sends DELETE request
    - Test 5: Error handling works when fetch fails
    - Mock global fetch function using Vitest
    - Reference: Test patterns from `/src/components/__tests__/TodoForm.spec.js`
  - [x] 2.2.7 Run service layer tests
    - Execute: `npm test src/services/__tests__/todoService.test.js`
    - Verify all 5 service tests pass

**Acceptance Criteria:**
- Service layer with 4 functions (fetch, create, update, delete)
- All functions use async/await with fetch API
- Error handling implemented in all functions
- 5 service layer tests pass

---

#### Task Group 2.3: Frontend Refactoring for API Integration
**Dependencies:** Task Group 2.2
**Assigned to:** Frontend Engineer

- [x] 2.3.0 Complete frontend refactoring to use API
  - [x] 2.3.1 Update todo structure from timestamp to created_at
    - Update App.vue line 41: Change `timestamp: Date.now()` to `created_at: Date.now()` (will be replaced with API response)
    - Update TodoList.vue line 54 comment: Change `{ id, text, completed, timestamp }` to `{ id, text, completed, created_at }`
    - Note: After API integration, created_at will come from backend, not client
  - [x] 2.3.2 Import service layer in App.vue
    - Add import at top of script section (after line 22):
    ```javascript
    import { onMounted } from 'vue'
    import { fetchTodos, createTodo, updateTodo, deleteTodo } from './services/todoService'
    ```
  - [x] 2.3.3 Add loading and error state to App.vue
    - Add after line 31: `const loading = ref(false)`
    - Add after loading: `const error = ref(null)`
  - [x] 2.3.4 Implement fetchTodos on component mount
    - Add after toggleTodo function (after line 67):
    ```javascript
    // Fetch todos from API when component mounts
    onMounted(async () => {
      loading.value = true
      error.value = null
      try {
        todos.value = await fetchTodos()
      } catch (err) {
        error.value = 'Failed to load todos'
        console.error(err)
      } finally {
        loading.value = false
      }
    })
    ```
  - [x] 2.3.5 Refactor addTodo handler to use API (App.vue lines 35-46)
    - Update addTodo function:
    ```javascript
    const addTodo = async (text) => {
      loading.value = true
      error.value = null
      try {
        const newTodo = await createTodo(text)
        todos.value.push(newTodo)
      } catch (err) {
        error.value = 'Failed to add todo'
        console.error(err)
      } finally {
        loading.value = false
      }
    }
    ```
    - Remove client-side id generation and timestamp
  - [x] 2.3.6 Refactor toggleTodo handler to use API (App.vue lines 59-67)
    - Update toggleTodo function:
    ```javascript
    const toggleTodo = async (id) => {
      const todo = todos.value.find(t => t.id === id)
      if (!todo) return

      loading.value = true
      error.value = null
      try {
        const updatedTodo = await updateTodo(id, !todo.completed)
        todos.value = todos.value.map(t =>
          t.id === id ? updatedTodo : t
        )
      } catch (err) {
        error.value = 'Failed to update todo'
        console.error(err)
      } finally {
        loading.value = false
      }
    }
    ```
  - [x] 2.3.7 Refactor deleteTodo handler to use API (App.vue lines 51-54)
    - Update deleteTodo function:
    ```javascript
    const deleteTodo = async (id) => {
      loading.value = true
      error.value = null
      try {
        await deleteTodo(id)
        todos.value = todos.value.filter(todo => todo.id !== id)
      } catch (err) {
        error.value = 'Failed to delete todo'
        console.error(err)
      } finally {
        loading.value = false
      }
    }
    ```
  - [x] 2.3.8 Add loading and error UI to template (App.vue lines 1-18)
    - Add loading indicator after line 7:
    ```vue
    <!-- Loading state -->
    <div v-if="loading" class="text-center text-gray-500">
      Loading...
    </div>

    <!-- Error message -->
    <div v-if="error" class="text-center text-red-500 mb-4">
      {{ error }}
    </div>
    ```
    - Place before TodoForm component

**Acceptance Criteria:**
- All event handlers refactored to use API calls
- Loading state displayed during API calls
- Error messages displayed on failure
- Todo structure uses created_at instead of timestamp
- onMounted hook fetches initial todos
- Comments updated to reflect API integration

---

#### Task Group 2.4: Phase 2 Integration Testing & Checkpoint
**Dependencies:** Task Group 2.3
**Assigned to:** Full-Stack Engineer

- [x] 2.4.0 Complete Phase 2 integration testing
  - [x] 2.4.1 Run all existing component tests
    - Execute: `npm test src/components/__tests__/`
    - Verify TodoForm and TodoList tests still pass
    - Fix any breaking tests due to API changes
  - [x] 2.4.2 Manual end-to-end testing
    - Run: `npm run dev` (both servers)
    - Open: http://localhost:5173
    - Test: Add new todo via form
    - Test: Toggle todo completion
    - Test: Delete todo
    - Test: Refresh page and verify todos persist (in-memory, will reset on server restart)
    - Verify: Loading states appear during operations
    - Verify: created_at field present in todos
  - [x] 2.4.3 Run all Phase 2 tests
    - Execute: `npm test`
    - Verify all tests pass (approximately 17 tests: 12 backend + 5 service layer)
  - [x] 2.4.4 Verify Phase 2 completion checklist
    - Confirm: Frontend communicates with backend API
    - Confirm: All CRUD operations work through UI
    - Confirm: Loading states visible
    - Confirm: Error handling working
    - Confirm: Vite proxy functioning
    - Confirm: npm run dev starts both servers

**Acceptance Criteria:**
- Manual E2E tests successful for all CRUD operations
- All tests pass (approximately 17 tests)
- Frontend-backend integration working
- Ready to proceed to Phase 3

---

### Phase 3: SQLite Database Setup

#### Task Group 3.1: Database Dependencies and Structure
**Dependencies:** Phase 2 Complete
**Assigned to:** Backend Engineer

- [x] 3.1.0 Complete database setup and initialization
  - [x] 3.1.1 Install SQLite dependency
    - Run: `npm install better-sqlite3`
    - Alternative: `npm install sqlite3` (if better-sqlite3 has issues)
    - Verify: Check package.json dependencies
  - [x] 3.1.2 Create database directory structure
    - Create directory: `/server/database/`
    - Note: Database file will be created automatically by init script
  - [x] 3.1.3 Create database initialization script at `/server/database/init.js`
    - Import database library: `const Database = require('better-sqlite3')`
    - Create database connection: `const db = new Database('./server/database/todos.db')`
    - Create SQL schema:
    ```sql
    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      text TEXT NOT NULL,
      completed INTEGER DEFAULT 0,
      created_at INTEGER NOT NULL
    )
    ```
    - Execute schema using `db.exec()`
    - Export database connection: `module.exports = db`
  - [x] 3.1.4 Add database initialization to server startup
    - Import db in `/server/index.js`: `const db = require('./database/init')`
    - Add after imports, before routes
    - Add console log: "Database initialized"
  - [x] 3.1.5 Test database creation
    - Run: `npm run dev:server`
    - Verify: `/server/database/todos.db` file created
    - Verify: Console shows "Database initialized"
    - Stop server
  - [x] 3.1.6 Add .gitignore entry for database file
    - Add to `.gitignore`: `server/database/*.db`
    - Note: Keep init.js in git, exclude .db files

**Acceptance Criteria:**
- better-sqlite3 installed
- Database initialization script created
- Database file created on server startup
- Schema with 4 columns (id, text, completed, created_at)
- Database connection exported and working
- .gitignore updated

---

#### Task Group 3.2: Database Query Helper Functions
**Dependencies:** Task Group 3.1
**Assigned to:** Backend Engineer

- [x] 3.2.0 Complete database query helper functions (preparation for Phase 4)
  - [x] 3.2.1 Create database queries file at `/server/database/queries.js`
    - Import db: `const db = require('./init')`
    - File structure: Export object with query functions
  - [x] 3.2.2 Implement getAllTodos() query function
    - Function: `getAllTodos()`
    - SQL: `SELECT * FROM todos ORDER BY created_at DESC`
    - Use: `db.prepare(sql).all()`
    - Return: Array of todo objects
    - Convert completed from INTEGER (0/1) to boolean
  - [x] 3.2.3 Implement createTodo(text) query function
    - Function: `createTodo(text)`
    - SQL: `INSERT INTO todos (text, completed, created_at) VALUES (?, 0, ?)`
    - Use parameterized query: `db.prepare(sql).run(text, Date.now())`
    - Get inserted id: `result.lastInsertRowid`
    - Fetch and return created todo using getTodoById()
  - [x] 3.2.4 Implement getTodoById(id) query function
    - Function: `getTodoById(id)`
    - SQL: `SELECT * FROM todos WHERE id = ?`
    - Use: `db.prepare(sql).get(id)`
    - Convert completed to boolean
    - Return: Todo object or null
  - [x] 3.2.5 Implement updateTodoCompleted(id, completed) query function
    - Function: `updateTodoCompleted(id, completed)`
    - SQL: `UPDATE todos SET completed = ? WHERE id = ?`
    - Convert boolean to INTEGER: `completed ? 1 : 0`
    - Use: `db.prepare(sql).run(completedInt, id)`
    - Fetch and return updated todo using getTodoById()
  - [x] 3.2.6 Implement deleteTodo(id) query function
    - Function: `deleteTodo(id)`
    - SQL: `DELETE FROM todos WHERE id = ?`
    - Use: `db.prepare(sql).run(id)`
    - Return: Number of changes (0 or 1)
  - [x] 3.2.7 Write 6 focused tests for database queries
    - Create `/server/database/__tests__/queries.test.js`
    - Test 1: getAllTodos() returns empty array initially
    - Test 2: createTodo() inserts and returns todo with auto-increment id
    - Test 3: getTodoById() retrieves specific todo
    - Test 4: updateTodoCompleted() updates status
    - Test 5: deleteTodo() removes todo
    - Test 6: Boolean conversion works (completed 0/1 <-> false/true)
    - Use in-memory database for testing: `new Database(':memory:')`
    - Clean up database after each test
  - [x] 3.2.8 Run Phase 3 database tests
    - Execute: `npm test server/database/__tests__/queries.test.js`
    - Verify all 6 database query tests pass

**Acceptance Criteria:**
- Query helper functions for all CRUD operations
- Parameterized queries prevent SQL injection
- Boolean conversion working (INTEGER <-> boolean)
- Auto-increment id working
- 6 database query tests pass

---

#### Task Group 3.3: Phase 3 Verification & Checkpoint
**Dependencies:** Task Group 3.2
**Assigned to:** Backend Engineer

- [x] 3.3.0 Complete Phase 3 verification
  - [x] 3.3.1 Test database queries directly
    - Create temporary test script or use node REPL
    - Import queries: `const queries = require('./server/database/queries')`
    - Test createTodo: `queries.createTodo('Test todo')`
    - Test getAllTodos: `queries.getAllTodos()`
    - Test updateTodoCompleted: `queries.updateTodoCompleted(1, true)`
    - Test deleteTodo: `queries.deleteTodo(1)`
    - Verify results
  - [x] 3.3.2 Inspect database file directly
    - Install sqlite3 CLI tool (if not installed)
    - Run: `sqlite3 server/database/todos.db`
    - Execute: `.schema` to verify table structure
    - Execute: `SELECT * FROM todos;` to check data
    - Exit: `.exit`
  - [x] 3.3.3 Run all Phase 3 tests
    - Execute: `npm test server/database/`
    - Verify all 6 database tests pass
  - [x] 3.3.4 Verify Phase 3 completion checklist
    - Confirm: Database file exists at `/server/database/todos.db`
    - Confirm: Table schema correct (id, text, completed, created_at)
    - Confirm: All query functions working
    - Confirm: Tests passing
    - Confirm: Ready for Phase 4 route refactoring

**Acceptance Criteria:**
- Database queries tested directly
- Database structure verified with SQLite CLI
- All Phase 3 tests pass (6 database tests)
- Phase 3 complete, ready for Phase 4

---

### Phase 4: Database-Backed API Implementation

#### Task Group 4.1: Backend Route Refactoring
**Dependencies:** Phase 3 Complete
**Assigned to:** Backend Engineer

- [x] 4.1.0 Complete backend refactoring from in-memory to database
  - [x] 4.1.1 Import database queries in routes file
    - Update `/server/routes/todos.js`
    - Import queries: `const queries = require('../database/queries')`
    - Remove in-memory todos array and idCounter variables
  - [x] 4.1.2 Refactor GET /api/todos to use database
    - Update route handler to call `queries.getAllTodos()`
    - Wrap in try-catch for error handling
    - Return: `res.status(200).json({ todos: result })`
    - Pass errors to error handler middleware: `next(error)`
  - [x] 4.1.3 Refactor POST /api/todos to use database
    - Keep validation logic (text must be non-empty)
    - Update to call `queries.createTodo(text)`
    - Return: `res.status(201).json({ todo: result })`
    - Remove manual id generation and created_at assignment
  - [x] 4.1.4 Refactor PUT /api/todos/:id to use database
    - Keep validation logic (completed must be boolean)
    - Update to call `queries.updateTodoCompleted(id, completed)`
    - Check if result is null (todo not found), throw 404
    - Return: `res.status(200).json({ todo: result })`
  - [x] 4.1.5 Refactor DELETE /api/todos/:id to use database
    - Update to call `queries.deleteTodo(id)`
    - Check if changes === 0 (todo not found), throw 404
    - Return: `res.status(200).json({ message: 'Todo deleted successfully' })`
  - [x] 4.1.6 Remove in-memory storage code
    - Delete todos array initialization from `/server/routes/todos.js`
    - Delete idCounter initialization
    - Clean up any references to in-memory storage
  - [x] 4.1.7 Update existing API tests for database
    - Update `/server/__tests__/todos.test.js`
    - Use in-memory database for tests: `new Database(':memory:')`
    - Initialize test database schema before each test
    - Clean up database after each test
    - Update all 6 API tests to work with database
  - [x] 4.1.8 Run Phase 4 API tests
    - Execute: `npm test server/__tests__/todos.test.js`
    - Verify all 6 refactored API tests pass

**Acceptance Criteria:**
- All routes refactored to use database queries
- In-memory storage code removed
- Error handling preserved
- Validation logic preserved
- 6 API tests updated and passing

---

#### Task Group 4.2: Data Persistence Verification
**Dependencies:** Task Group 4.1
**Assigned to:** Full-Stack Engineer

- [x] 4.2.0 Complete data persistence verification
  - [x] 4.2.1 Test data persistence across server restarts
    - Run: `npm run dev`
    - Add multiple todos via UI
    - Note: Todo IDs and text
    - Stop server (Ctrl+C)
    - Restart: `npm run dev`
    - Verify: Todos still present after refresh
    - Verify: IDs match previous session
  - [x] 4.2.2 Test full CRUD cycle with persistence
    - Add todo: "Task 1"
    - Restart server
    - Verify: "Task 1" still exists
    - Toggle completion
    - Restart server
    - Verify: Completion status persisted
    - Delete todo
    - Restart server
    - Verify: Todo deleted permanently
  - [x] 4.2.3 Verify created_at timestamps
    - Add several todos with delays between each
    - Check network tab in browser DevTools
    - Verify: created_at field present in API responses
    - Verify: Timestamps are Unix milliseconds
    - Verify: Timestamps are different for each todo
    - Verify: Todos display in order (if sorted by created_at)

**Acceptance Criteria:**
- Todos persist across server restarts
- All CRUD operations persist to database
- created_at timestamps working correctly
- Data integrity maintained

---

#### Task Group 4.3: Final Testing & Integration Verification
**Dependencies:** Task Group 4.2
**Assigned to:** QA / Full-Stack Engineer

- [x] 4.3.0 Complete final testing and gap analysis
  - [x] 4.3.1 Review all existing tests
    - Backend smoke tests: 3 tests (Task 1.1.5)
    - Error handler tests: 3 tests (Task 1.2.3)
    - API endpoint tests: 6 tests (Task 1.3.7, updated in 4.1.7)
    - Service layer tests: 5 tests (Task 2.2.6)
    - Database query tests: 6 tests (Task 3.2.7)
    - Total: Approximately 23 tests
  - [x] 4.3.2 Run complete test suite
    - Execute: `npm test`
    - Verify all tests pass
    - Note any failures
  - [x] 4.3.3 Identify critical test gaps (max 8 additional tests)
    - Review end-to-end workflows not covered
    - Identify integration points between layers
    - Focus on critical user paths only
    - Skip: Edge cases, performance, accessibility
  - [x] 4.3.4 Write up to 8 strategic integration tests (if needed)
    - Create `/server/__tests__/integration.test.js` if gaps found
    - Potential Test 1: Full create-read-update-delete workflow
    - Potential Test 2: Error propagation from database to API response
    - Potential Test 3: CORS headers present in responses
    - Potential Test 4: Concurrent requests don't corrupt data
    - Only add tests for identified critical gaps
    - Maximum 8 additional tests
  - [x] 4.3.5 Run final complete test suite
    - Execute: `npm test`
    - Expected: Approximately 23-31 tests total
    - Verify all tests pass
  - [x] 4.3.6 Final manual E2E verification
    - Delete database file: `rm server/database/todos.db`
    - Run: `npm run dev`
    - Test complete user journey:
      1. Page loads empty
      2. Add 5 todos
      3. Toggle 2 todos to completed
      4. Delete 1 todo
      5. Refresh page
      6. Verify: 4 todos present with correct states
      7. Stop server and restart
      8. Verify: Data persisted
  - [x] 4.3.7 Verify final completion checklist
    - Confirm: All 4 phases complete
    - Confirm: Express API fully functional
    - Confirm: SQLite database persisting data
    - Confirm: Frontend integrated with backend
    - Confirm: All tests passing (23-31 tests)
    - Confirm: Manual E2E tests successful
    - Confirm: created_at used throughout (not timestamp)

**Acceptance Criteria:**
- Complete test suite passes (23-31 tests)
- No critical test gaps remaining
- Maximum 8 additional integration tests added
- Manual E2E verification successful
- All acceptance criteria met for all 4 phases

---

## Execution Order Summary

**Phase 1: Express Server with In-Memory Storage**
1. Server Foundation (Task Group 1.1)
2. Error Handling Middleware (Task Group 1.2)
3. REST API Endpoints (Task Group 1.3)
4. Phase 1 Testing & Checkpoint (Task Group 1.4)

**Phase 2: Frontend Integration with API**
1. Development Environment Setup (Task Group 2.1)
2. Frontend Service Layer (Task Group 2.2)
3. Frontend Refactoring (Task Group 2.3)
4. Phase 2 Testing & Checkpoint (Task Group 2.4)

**Phase 3: SQLite Database Setup**
1. Database Dependencies and Structure (Task Group 3.1)
2. Database Query Helper Functions (Task Group 3.2)
3. Phase 3 Verification & Checkpoint (Task Group 3.3)

**Phase 4: Database-Backed API Implementation**
1. Backend Route Refactoring (Task Group 4.1)
2. Data Persistence Verification (Task Group 4.2)
3. Final Testing & Integration Verification (Task Group 4.3)

---

## Key Technical Details Reference

**File Paths:**
- Express entry: `/server/index.js`
- Routes: `/server/routes/todos.js`
- Middleware: `/server/middleware/errorHandler.js`
- Database init: `/server/database/init.js`
- Database queries: `/server/database/queries.js`
- Database file: `/server/database/todos.db`
- Service layer: `/src/services/todoService.js`
- Frontend tests: `/src/services/__tests__/todoService.test.js`
- Backend tests: `/server/__tests__/` (multiple files)

**API Endpoints:**
- GET /api/todos (200)
- POST /api/todos (201)
- PUT /api/todos/:id (200)
- DELETE /api/todos/:id (200)

**Database Schema:**
```sql
CREATE TABLE todos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  text TEXT NOT NULL,
  completed INTEGER DEFAULT 0,
  created_at INTEGER NOT NULL
);
```

**Todo Object Structure:**
```javascript
{
  id: 1,                    // Database auto-increment
  text: "Todo text",        // User input
  completed: false,         // Boolean (stored as 0/1 in DB)
  created_at: 1731600000000 // Unix timestamp milliseconds
}
```

**npm Scripts:**
- `npm run dev:server` - Run backend only
- `npm run dev:client` - Run frontend only
- `npm run dev` - Run both concurrently
- `npm test` - Run all tests

**Standards Compliance:**
- RESTful API design (standards/backend/api.md)
- Minimal test coverage during development (standards/testing/test-writing.md)
- Centralized error handling (standards/global/error-handling.md)
- Express + SQLite + Vue 3 stack (standards/global/tech-stack.md)
