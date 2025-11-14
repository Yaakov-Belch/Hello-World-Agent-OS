# Product Roadmap

1. [x] Static Welcome Display — Create a basic Vue component that displays "Hello World!" message with simple styling, teaching Vue template syntax, component structure, and data binding fundamentals. `XS`

2. [x] Interactive Counter — Build increment/decrement button controls that modify a reactive counter state, demonstrating Vue's reactivity system, event handling, and state management basics. `XS`

3. [x] Todo Input Form — Add a text input field with submit functionality to create new todo items, introducing form handling, v-model directive, and basic validation patterns in Vue. `S`

4. [x] Todo List Display — Render the list of todos with toggle complete and delete actions using v-for directive, teaching list rendering, conditional styling, and array manipulation. `S`

5. [x] Express API Server — Create a Node.js/Express backend with REST endpoints (GET, POST, PUT, DELETE) for todos, teaching HTTP methods, routing, middleware, and API design principles. `M`

6. [x] Frontend API Integration — Refactor frontend to fetch todos from the Express API instead of localStorage, demonstrating async/await patterns, fetch API usage, and client-server communication. `S`

7. [x] SQLite Database Setup — Configure SQLite database with todos table schema and implement database connection layer, introducing SQL fundamentals, data modeling, and database initialization. `M`

8. [x] Database-Backed API — Update Express endpoints to read/write from SQLite instead of in-memory storage, teaching SQL queries, database transactions, and persistent server-side state. `M`

9. [ ] End-to-End Testing Suite — Add Vitest tests covering each feature from static display through database operations, demonstrating unit testing, integration testing, and test organization patterns. `L`

> Notes
> - Order follows progressive learning path: Vue basics → State management → Frontend CRUD → Client-server → Database
> - Each item represents a complete, testable feature that builds on previous concepts
> - Features 1-4 focus on frontend skills, features 5-8 introduce full-stack architecture
> - Feature 9 reinforces all learning with comprehensive testing
> - Dependencies: Feature 6 requires Feature 5, Feature 8 requires Feature 7
