# Tech Stack

## Framework & Runtime
- **Application Framework:** Express
- **Language/Runtime:** Node.js
- **Package Manager:** npm

**Rationale:** Express is the most widely-used Node.js web framework with extensive documentation and beginner-friendly patterns. Node.js enables JavaScript on both frontend and backend, reducing context switching for learners. npm provides the largest ecosystem of packages with simple setup.

## Frontend
- **JavaScript Framework:** Vue 3 (with Composition API)
- **CSS Framework:** Tailwind CSS
- **UI Components:** None

**Rationale:** Vue 3 with Composition API represents modern Vue development and is more intuitive for beginners than Options API. The reactive system is easier to understand than React's hooks or Angular's complexity. Tailwind CSS provides utility-first styling that's faster to learn than writing custom CSS or learning component libraries. No UI component library keeps the focus on understanding fundamentals rather than configuring third-party components.

## Database & Storage
- **Database:** SQLite
- **ORM/Query Builder:** None
- **Caching:** None

**Rationale:** SQLite requires zero configuration - it's a single file database perfect for learning SQL fundamentals without the complexity of database servers. Writing raw SQL queries (without an ORM) teaches database concepts directly. No caching layer keeps the architecture simple and understandable.

## Testing & Quality
- **Test Framework:** Vitest
- **Linting/Formatting:** ESLint + Prettier

**Rationale:** Vitest is built for Vue 3 and uses the same Vite tooling, providing fast test execution and familiar configuration. ESLint catches common errors and enforces consistent code style. Prettier automates formatting so learners don't waste time on style debates.

## Deployment & Infrastructure
- **Hosting:** None (run locally)
- **CI/CD:** None

**Rationale:** Local development eliminates deployment complexity and keeps focus on learning core development skills. No CI/CD reduces tooling overhead for beginners.

## Third-Party Services
- **Authentication:** None
- **Email:** None
- **Monitoring:** None

**Rationale:** No external services keeps the learning path focused on core full-stack development concepts. Students can add these in their own extensions after mastering the fundamentals.

## Development Tools
- **Build Tool:** Vite (bundled with Vue 3)
- **API Testing:** None (can use browser or curl)
- **Database Management:** None (SQLite CLI or DB Browser for SQLite)

**Rationale:** Vite comes with Vue 3 scaffolding and provides instant hot module replacement. No specialized API testing tools - learners use browser DevTools or curl to understand HTTP directly. SQLite's simplicity means no special database management tools are required.

## Progressive Learning Path

### Phase 1-2: Frontend Basics (Vue Only)
- Vue 3 + Vite
- Tailwind CSS
- ESLint + Prettier

### Phase 3: Frontend Application (Add State Persistence)
- Previous stack + localStorage API

### Phase 4-5: Full-Stack (Add Backend & Database)
- Previous stack + Express + SQLite
- Vitest for comprehensive testing

This staged introduction allows learners to master each layer before adding complexity.
