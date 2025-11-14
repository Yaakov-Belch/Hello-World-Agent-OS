# Specification: Full-Stack Todo Application Backend and Integration

## Goal
Build a complete full-stack todo application by implementing an Express REST API server with SQLite database persistence, and integrating it with the existing Vue 3 frontend. This transforms the current in-memory todo app into a database-backed client-server architecture, teaching core full-stack development concepts including HTTP methods, API design, SQL databases, and async client-server communication.

## User Stories
- As a developer learning full-stack architecture, I want to create an Express REST API server so that I understand how backends handle HTTP requests and serve data to frontend clients
- As a developer learning database concepts, I want to persist todos in SQLite so that I understand how data is stored, queried, and managed in relational databases
- As a developer learning client-server integration, I want to refactor the Vue frontend to communicate with the backend API so that I understand asynchronous patterns and the separation between frontend and backend layers

## Specific Requirements

**Express Server Structure**
- Entry point at `/server/index.js` running on port 3000
- Route handlers organized in `/server/routes/todos.js` for clean separation of concerns
- Error handling middleware at `/server/middleware/errorHandler.js` for centralized error responses
- Basic CORS configuration for development (allowing localhost:5173)
- JSON body parsing middleware for POST/PUT requests

**RESTful API Endpoints**
- `GET /api/todos` returns all todos as JSON array, status 200
- `POST /api/todos` expects `{ text }` in body, creates todo with auto-incremented id and `created_at` timestamp, returns created todo with status 201
- `PUT /api/todos/:id` expects `{ completed }` boolean in body, updates todo completion status, returns updated todo with status 200
- `DELETE /api/todos/:id` removes todo from storage, returns status 200 with success message
- All endpoints return appropriate HTTP status codes: 404 for not found, 400 for validation errors, 500 for server errors
- Validation: text field must be non-empty string, completed must be boolean

**SQLite Database Schema**
- Database file location: `/server/database/todos.db`
- Table name: `todos` (plural following convention)
- Columns: `id` (INTEGER PRIMARY KEY AUTOINCREMENT), `text` (TEXT NOT NULL), `completed` (INTEGER DEFAULT 0 for boolean storage), `created_at` (INTEGER storing Unix timestamp in milliseconds)
- Database initialization script at `/server/database/init.js` creates table if not exists on server startup
- Use parameterized queries to prevent SQL injection vulnerabilities
- Close database connections properly to avoid resource leaks

**Frontend Service Layer**
- Service module at `/src/services/todoService.js` encapsulates all API calls
- Export async functions: `fetchTodos()`, `createTodo(text)`, `updateTodo(id, completed)`, `deleteTodo(id)`
- Use native Fetch API with async/await patterns for all HTTP requests
- Handle API errors gracefully and return error objects for component consumption
- Base URL configuration handles development proxy (requests to `/api/todos` proxied to `http://localhost:3000/api/todos`)

**Frontend Integration Updates**
- Refactor App.vue to use service layer instead of in-memory state management
- Update `addTodo` handler to call `createTodo()` API, then add returned todo to local state
- Update `toggleTodo` handler to call `updateTodo()` API with new completed status, then update local state
- Update `deleteTodo` handler to call `deleteTodo()` API, then remove from local state
- Add `onMounted()` lifecycle hook to call `fetchTodos()` and populate initial state
- Update todo object structure from `timestamp` to `created_at` throughout frontend (App.vue line 41, TodoList.vue line 54 comment)
- Add loading state during API calls for better UX
- Display user-friendly error messages when API calls fail

**Development Environment Setup**
- Vite proxy configuration in `vite.config.js` forwards `/api` requests to `http://localhost:3000`
- npm script `dev:server` runs Express backend with `node server/index.js`
- npm script `dev:client` runs Vite frontend with `npm run dev`
- npm script `dev` uses `concurrently` package to run both servers simultaneously
- Add `concurrently` to devDependencies in package.json
- Express server serves on port 3000, Vite dev server on port 5173

**Progressive Implementation Phases**
- Phase 1: Create Express server with in-memory array storage, implement all REST endpoints, test with tools like curl or Postman
- Phase 2: Build frontend service layer, update App.vue to use API, test full integration with in-memory backend
- Phase 3: Set up SQLite database schema and initialization, verify database file creation and table structure
- Phase 4: Refactor Express routes from in-memory storage to database queries, verify data persists across server restarts

**Testing Requirements**
- Backend tests in `/server/__tests__/todos.test.js` cover all API endpoints (GET, POST, PUT, DELETE)
- Backend tests verify correct status codes, response formats, and error handling
- Frontend service tests in `/src/services/__tests__/todoService.test.js` verify API calls with mocked fetch responses
- Use Vitest for both frontend and backend testing (already configured)
- Mock database operations in backend tests to avoid test data pollution
- Follow minimal testing approach: focus on critical paths, skip edge cases during development

**Data Consistency and Migration**
- Change todo object structure from `{ id, text, completed, timestamp }` to `{ id, text, completed, created_at }`
- Database stores `created_at` as INTEGER (Unix milliseconds timestamp)
- API returns `created_at` field in responses
- Update all frontend references from `timestamp` to `created_at`

**Error Handling Strategy**
- Centralized error handling middleware catches all route errors and returns consistent JSON error format
- Client-facing error messages are user-friendly without exposing technical details
- Server logs detailed errors for debugging but returns sanitized messages to client
- HTTP status codes accurately reflect error types (400 for validation, 404 for not found, 500 for server errors)

## Visual Design
No visual assets provided. The existing Vue frontend UI remains unchanged - only the data layer is being updated to communicate with the backend API instead of managing in-memory state.

## Existing Code to Leverage

**TodoForm.vue validation pattern**
- Input validation with error state management (lines 40-49)
- Event emission pattern with `defineEmits(['add-todo'])` (line 70)
- Form submission handler with trim validation (lines 41-60)
- Reactive error clearing on user input (lines 63-67)
- Reuse this validation logic when building backend API validation

**TodoList.vue event handling pattern**
- Props definition for todos array (lines 55-60)
- Event emission for toggle and delete actions (lines 63-75)
- Conditional rendering for empty state (line 4)
- Comment on line 54 mentions `{ id, text, completed, timestamp }` structure - must update to `created_at`

**App.vue state management structure**
- Reactive todos state with ref([]) initialization (line 31)
- Event handler pattern for add/toggle/delete operations (lines 35-67)
- Comments indicate preparation for backend integration (line 28-29, 45-46, 53-54, 61-62)
- Current id generation `Date.now() + Math.random()` (line 38) will be replaced with database auto-increment
- Current `timestamp: Date.now()` (line 41) will become `created_at` from API response

**Vitest test structure from TodoForm.spec.js**
- Use `describe` and `it` blocks for test organization
- Mount components with `@vue/test-utils` for frontend tests
- Test async behavior with `async/await` syntax
- Verify emitted events with `wrapper.emitted()` assertions
- Apply similar patterns when testing service layer and backend endpoints

**Package.json and Vite configuration**
- Vitest already configured in package.json devDependencies (line 27)
- Vite test configuration in vite.config.js with happy-dom environment (lines 6-9)
- Need to add Express, SQLite driver (better-sqlite3 or sqlite3), and concurrently to dependencies
- Update test script if needed to run both frontend and backend tests

## Out of Scope
- Authentication and authorization systems
- User accounts or multi-user support
- Input sanitization beyond basic non-empty validation (no XSS protection)
- Database migration tooling or versioning systems
- API versioning schemes (no /api/v1 structure)
- Rate limiting or throttling mechanisms
- Advanced CORS configuration beyond development localhost
- Request logging middleware or analytics
- localStorage implementation or offline fallback
- Production deployment configuration or environment-specific builds
- API documentation generation (Swagger/OpenAPI)
- Pagination for todo list endpoints
- Todo text editing after creation (only completion toggle and delete)
- Additional todo fields like due dates, priorities, categories, or tags
- Search or filtering capabilities
- Sorting options for todo list
- Database optimization or indexing beyond primary key
- Transaction management for complex operations
- Connection pooling or database performance tuning
- Soft deletes or todo archive functionality
- Undo/redo capabilities
- Real-time updates via WebSockets
