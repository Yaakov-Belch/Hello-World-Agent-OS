# Specification: Todo Input Form and List Display

## Goal
Create a todo application with input form and dynamic list display components, demonstrating Vue 3 state management, form handling, validation, list rendering, and component composition patterns while preparing architecture for future backend integration.

## User Stories
- As a user, I want to add new todo items via a text input form so that I can track tasks I need to complete
- As a user, I want to see all my todo items in a list and mark them as complete or delete them so that I can manage my tasks effectively

## Specific Requirements

**State Management Architecture**
- Manage all todo state at App.vue level using Vue 3 ref() for reactive array
- Pass todos array down to TodoList.vue component via props
- Emit custom events from TodoForm.vue and TodoList.vue to App.vue for state changes (add, delete, toggle)
- Use this parent-child data flow pattern to prepare for future backend API integration
- State modifications must only occur in App.vue event handlers

**Todo Data Structure**
- Each todo object must include: id (unique identifier for v-for key binding), text (string, trimmed), completed (boolean), timestamp (Date or number for future sorting)
- Generate unique IDs using Date.now() or similar approach
- Maintain insertion order (newest todos appear last in array)
- Initialize state with empty array on component mount

**TodoForm Component (TodoForm.vue)**
- Accept no props, emit 'add-todo' custom event with todo text payload
- Use v-model directive to bind input field to local reactive state
- Implement form submit handler with @submit.prevent to prevent page reload
- Validate input before emitting: trim whitespace, check for empty string
- Clear input field immediately after successful validation and event emission
- Display dual validation feedback: inline error message below input AND red border styling on input field
- Clear error state when user types valid input (reactive validation clearing)

**TodoList Component (TodoList.vue)**
- Accept todos array as prop with proper type definition
- Emit 'delete-todo' event with todo id when delete button clicked
- Emit 'toggle-todo' event with todo id when completion checkbox/button clicked
- Use v-for directive with proper :key binding using todo.id
- Render each todo with text, completion toggle (checkbox), and delete button
- Apply visual distinction for completed todos (strikethrough text, muted color)
- Display message when todo list is empty (conditional rendering with v-if)

**Input Validation and User Feedback**
- Prevent submission of empty todos (after trimming whitespace)
- Show inline error message: "Todo cannot be empty" below input field when validation fails
- Add red border to input field when validation fails (e.g., border-red-500)
- Remove error message and red border when user starts typing again
- Validation state should be managed locally in TodoForm.vue using reactive ref

**Visual Design with Tailwind CSS**
- Follow minimal, clean design patterns from InteractiveCounter.vue
- Use Tailwind utility classes for all styling (no custom CSS)
- Button styles: bg-blue-500 with hover:bg-blue-600, active:bg-blue-700, transition-colors
- Input field: border, padding, rounded corners, focus states
- Error state: border-red-500 for input, text-red-500 for error message
- Completed todos: line-through text decoration, text-gray-400 or similar muted color
- Layout: use flexbox utilities for spacing and alignment
- Responsive padding and sizing consistent with existing components

**Component Structure and File Organization**
- Create TodoForm.vue in /src/components/ directory
- Create TodoList.vue in /src/components/ directory
- Update App.vue to import both components and manage state
- Use Vue 3 Composition API with script setup syntax in all components
- Follow three-section structure: template, script setup, style (empty)

## Visual Design

No visual assets provided. Implementation should follow the minimal, clean design patterns established in InteractiveCounter.vue component.

## Existing Code to Leverage

**InteractiveCounter.vue - Vue 3 Composition API Patterns**
- Use script setup syntax with ref() for reactive state management
- Follow event handler naming conventions and implementation patterns
- Apply Tailwind button styling approach (bg-blue-500, hover states, transition-colors)
- Include clear descriptive comments explaining Vue concepts for learning purposes
- Maintain clean three-section component structure (template, script setup, style)

**App.vue - Component Composition Pattern**
- Import child components at top of script setup section
- Use components in template with clear layout structure (flexbox with gap utilities)
- Extend existing layout to include TodoForm and TodoList alongside existing components
- Maintain consistent spacing and centering patterns

**WelcomeDisplay.vue - Simple Component Structure**
- Reference for minimal component implementation without props or events
- Shows clean template-only components when no logic is needed

**Tailwind CSS Utility Patterns**
- Consistent use of spacing utilities (px-6, py-3, gap-4)
- Color utilities with hover/active states (bg-blue-500, hover:bg-blue-600, active:bg-blue-700)
- Typography utilities (text-4xl, font-bold)
- Layout utilities (flex, items-center, justify-center)
- Border radius and transitions for polished UI

**Vue 3 Reactivity System**
- Import ref from 'vue' for creating reactive state
- Access reactive values via .value in script, direct interpolation in template
- Use reactive state for counter, input text, validation errors, and todos array

## Out of Scope
- localStorage persistence (explicitly excluded to prepare for backend integration)
- Backend server integration (planned for next stage)
- Todo editing functionality (modifying text of existing todos)
- Sorting or filtering todos by any criteria
- Search functionality within todos
- Todo categories, tags, or labels
- Due dates or priority levels
- Todo reordering or drag-and-drop
- Bulk actions (delete all, mark all complete)
- Undo/redo functionality
- Keyboard shortcuts beyond standard form submission
