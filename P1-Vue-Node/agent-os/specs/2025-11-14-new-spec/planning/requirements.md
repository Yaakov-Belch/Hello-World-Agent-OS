# Spec Requirements: Full-Stack Todo Application Backend and Integration

## Initial Description
Full-Stack Todo Application Backend and Integration

This spec covers implementing the remaining roadmap items for the Hello World Agent OS learning project:

5. Express API Server — Create a Node.js/Express backend with REST endpoints (GET, POST, PUT, DELETE) for todos, teaching HTTP methods, routing, middleware, and API design principles. `M`

6. Frontend API Integration — Refactor frontend to fetch todos from the Express API instead of localStorage, demonstrating async/await patterns, fetch API usage, and client-server communication. `S`

7. SQLite Database Setup — Configure SQLite database with todos table schema and implement database connection layer, introducing SQL fundamentals, data modeling, and database initialization. `M`

8. Database-Backed API — Update Express endpoints to read/write from SQLite instead of in-memory storage, teaching SQL queries, database transactions, and persistent server-side state. `M`

This follows the progressive learning path from the existing Vue frontend (features 1-4 already completed) to introduce full-stack architecture concepts.

## Requirements Discussion

### First Round Questions

**Q1: Express Server Structure**
I assume you want the Express server in a `/server` directory at the project root, with `/server/index.js` as the entry point, `/server/routes/todos.js` for route handlers, and `/server/middleware` for error handling. Is that correct?

**Answer:** Agreed - `/server` directory with `/server/index.js`, `/server/routes/todos.js`, and `/server/middleware`

**Q2: API Endpoint Design**
I'm thinking we should follow RESTful conventions with these endpoints:
- `GET /api/todos` - Fetch all todos
- `POST /api/todos` - Create new todo (expects `{ text }` in request body)
- `PUT /api/todos/:id` - Update todo completion status (expects `{ completed }` in request body)
- `DELETE /api/todos/:id` - Delete todo

Should we use these exact endpoint patterns, or would you prefer different HTTP methods or URL structures?

**Answer:** Agreed - RESTful conventions with:
- `GET /api/todos`
- `POST /api/todos` (expects `{ text }`)
- `PUT /api/todos/:id` (expects `{ completed }`)
- `DELETE /api/todos/:id`

**Q3: Database Schema**
I assume the SQLite todos table should have columns: `id` (INTEGER PRIMARY KEY AUTOINCREMENT), `text` (TEXT NOT NULL), `completed` (INTEGER DEFAULT 0), and `timestamp` (INTEGER). Is that the schema you want, or should we include additional fields like created_at/updated_at?

**Answer:** The frontend already has a timestamp - create a consistent solution with `created_at` instead of just `timestamp`

**Q4: Database Location**
I'm thinking the SQLite database file should live at `/server/database/todos.db` with an initialization script at `/server/database/init.js` that creates the table schema if it doesn't exist. Does that structure work?

**Answer:** Agreed - `/server/database/todos.db` with initialization scripts

**Q5: Error Handling**
I assume you want middleware for error handling and request logging in `/server/middleware/errorHandler.js` and `/server/middleware/logger.js`. Should we implement both, or keep it simpler?

**Answer:** Yes to error handling middleware, NO to request logging middleware

**Q6: Frontend-Backend Communication**
I'm thinking we should create a service layer at `/src/services/todoService.js` that encapsulates all API calls using fetch with async/await patterns. This service will handle loading states and error messages. Should the service return both data and error states, or throw errors for the components to catch?

**Answer:** Agreed - service layer at `/src/services/todoService.js` with async/await patterns, loading states, and error handling

**Q7: Development Workflow**
I assume you want the Express server running on port 3000 and Vite dev server on 5173, with Vite proxy configuration to forward `/api` requests to Express. We'll need npm scripts like `npm run dev:server`, `npm run dev:client`, and `npm run dev` (runs both concurrently). Is this the development setup you want?

**Answer:** Agreed - Express on port 3000, Vite on 5173, proxy configuration, npm scripts for running both

**Q8: Progressive Implementation**
I'm thinking we should implement this in 4 phases:
1. Express server with in-memory todo storage + REST endpoints
2. Frontend integration with API (removing localStorage)
3. SQLite database setup + schema
4. Backend refactor from in-memory to database storage

This allows testing each layer before adding database complexity. Does this progressive approach match your learning goals?

**Answer:** Yes to 4-phase approach. IMPORTANT: There is NO localStorage currently - and we don't want to add it as a fallback

**Q9: Testing Strategy**
I assume you want Vitest tests in `/server/__tests__` for backend API endpoints and `/server/database/__tests__` for database operations, plus `/src/services/__tests__` for the frontend service layer. Should we include tests for the Express middleware too?

**Answer:** Yes - tests in `/server/__tests__` for backend and `/src/services/__tests__` for frontend service layer

**Q10: Scope Exclusions**
Are there any features we should explicitly exclude? For example: authentication/authorization, input sanitization beyond basic validation, database migrations tooling, API versioning, rate limiting, or CORS configuration beyond basic development setup?

**Answer:** Keep it simple. All of these features are OUT OF SCOPE: authentication/authorization, input sanitization beyond basic validation, database migrations tooling, API versioning, rate limiting, CORS configuration beyond basic development setup

### Existing Code to Reference

**Similar Features Identified:**
- Existing frontend code: TodoForm.vue, TodoList.vue, and App.vue provide the current in-memory implementation
- File paths:
  - `/src/components/TodoForm.vue` - Form component with validation
  - `/src/components/TodoList.vue` - List rendering with toggle/delete
  - `/src/App.vue` - Current state management and event handlers
- Current todo object structure: `{ id, text, completed, timestamp }` (Note: will be changed to `created_at` for consistency)
- Current ID generation: `Date.now() + Math.random()` (will be replaced with database auto-increment)

**Backend Code:**
No existing backend code - this is the first backend implementation for the project.

### Follow-up Questions

**Follow-up 1:** I see the frontend currently uses `timestamp: Date.now()` when creating todos (in App.vue line 41). Since you want `created_at` instead for consistency, should the database column be named `created_at` (storing an INTEGER timestamp), and should the backend API return todos with a `created_at` field? Also, should we update the existing frontend to expect `created_at` instead of `timestamp`?

**Answer:** Yes - the database column should be `created_at` (INTEGER), the API should return `created_at`, and the frontend should be updated to use `created_at` consistently throughout the application (App.vue, TodoList.vue comments, etc.)

## Visual Assets

### Files Provided:
No visual files found in `/agent-os/specs/2025-11-14-new-spec/planning/visuals/`

### Visual Insights:
No visual assets provided.

## Requirements Summary

### Functional Requirements

**Backend API (Express Server):**
- Create Express server at `/server/index.js` running on port 3000
- Implement RESTful API endpoints:
  - `GET /api/todos` - Returns all todos from storage
  - `POST /api/todos` - Creates new todo, expects `{ text }`, returns created todo
  - `PUT /api/todos/:id` - Updates todo completion status, expects `{ completed }`, returns updated todo
  - `DELETE /api/todos/:id` - Deletes todo, returns success confirmation
- Error handling middleware at `/server/middleware/errorHandler.js`
- Route handlers in `/server/routes/todos.js`

**Database Layer (SQLite):**
- SQLite database file at `/server/database/todos.db`
- Database initialization script at `/server/database/init.js`
- Todos table schema:
  - `id` - INTEGER PRIMARY KEY AUTOINCREMENT
  - `text` - TEXT NOT NULL
  - `completed` - INTEGER DEFAULT 0 (0 = false, 1 = true)
  - `created_at` - INTEGER (Unix timestamp in milliseconds)
- Database initialization creates table if it doesn't exist

**Frontend Integration:**
- Service layer at `/src/services/todoService.js` encapsulating all API calls
- Async/await patterns for all API operations
- Loading states during API calls
- Error handling for failed requests
- Update App.vue to use service layer instead of in-memory state
- Update frontend to use `created_at` field instead of `timestamp`

**Development Workflow:**
- Express server runs on port 3000
- Vite dev server runs on port 5173
- Vite proxy configuration forwards `/api` requests to Express
- npm scripts:
  - `npm run dev:server` - Runs Express backend only
  - `npm run dev:client` - Runs Vite frontend only
  - `npm run dev` - Runs both concurrently

**Progressive Implementation Phases:**
1. Phase 1: Express server with in-memory todo storage + REST endpoints
2. Phase 2: Frontend integration with API (replacing in-memory state)
3. Phase 3: SQLite database setup + schema initialization
4. Phase 4: Backend refactor from in-memory to database storage

**Testing Requirements:**
- Backend tests in `/server/__tests__/` for API endpoints
- Frontend tests in `/src/services/__tests__/` for service layer
- Test framework: Vitest (already in project)

### Reusability Opportunities

**Frontend Components to Reference:**
- `/src/components/TodoForm.vue` - Form validation and event emission patterns
- `/src/components/TodoList.vue` - List rendering and event handling patterns
- `/src/App.vue` - Current state management structure (will be refactored to use API)

**Current Todo Object Structure:**
```javascript
{
  id: Date.now() + Math.random(), // Will become database auto-increment
  text: "Todo text",
  completed: false,
  timestamp: Date.now() // Will become created_at
}
```

**Updated Todo Object Structure (after backend integration):**
```javascript
{
  id: 1, // Database auto-increment INTEGER
  text: "Todo text",
  completed: false, // Or true
  created_at: 1731600000000 // Unix timestamp in milliseconds
}
```

### Scope Boundaries

**In Scope:**
- Express REST API server with todos endpoints
- SQLite database with todos table
- Database initialization and connection layer
- Frontend service layer for API communication
- Error handling middleware
- Development environment setup (proxy, npm scripts)
- Basic input validation (non-empty text)
- Vitest tests for backend and frontend service layer
- Progressive 4-phase implementation
- Updating frontend to use `created_at` instead of `timestamp`

**Out of Scope:**
- Authentication and authorization
- Input sanitization beyond basic validation (no XSS protection, SQL injection is naturally prevented by parameterized queries)
- Database migrations tooling
- API versioning (e.g., /api/v1)
- Rate limiting
- Advanced CORS configuration (only basic development setup)
- Request logging middleware
- localStorage implementation or fallback
- Production deployment configuration
- API documentation (Swagger/OpenAPI)
- Pagination for todo list
- Todo editing (changing text after creation)
- Due dates or priority levels
- User accounts or multi-user support

### Technical Considerations

**Framework & Runtime:**
- Express for backend API framework
- Node.js runtime (version as specified in project)
- npm for package management

**Database:**
- SQLite for zero-configuration database
- Raw SQL queries (no ORM) for learning purposes
- File-based database at `/server/database/todos.db`

**Frontend Integration:**
- Fetch API for HTTP requests
- Async/await for asynchronous operations
- Service layer pattern for API encapsulation
- Error state management in components

**Development Tools:**
- Vite proxy for API forwarding during development
- Concurrent npm scripts for running frontend + backend
- Vitest for testing both frontend and backend

**Data Consistency:**
- Database uses `created_at` field (INTEGER timestamp)
- API returns `created_at` field
- Frontend updated from `timestamp` to `created_at`
- Boolean `completed` stored as INTEGER (0/1) in SQLite

**Error Handling:**
- Express error handling middleware catches and formats errors
- Frontend service layer returns errors for component handling
- HTTP status codes: 200 (success), 201 (created), 404 (not found), 500 (server error)

**Similar Patterns to Follow:**
- Vue Composition API patterns from existing components
- Event emission patterns from TodoForm and TodoList
- State management patterns from App.vue (will be enhanced with API calls)
- Tailwind CSS styling patterns for consistency
