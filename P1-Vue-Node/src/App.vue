<template>
  <div class="min-h-screen flex flex-col items-center justify-center gap-8 py-8">
    <WelcomeDisplay />
    <InteractiveCounter />

    <!-- Todo application section -->
    <div class="w-full max-w-md px-4 flex flex-col gap-6">
      <!-- Loading state -->
      <div v-if="loading" class="text-center text-gray-500">
        Loading...
      </div>

      <!-- Error message -->
      <div v-if="error" class="text-center text-red-500 mb-4">
        {{ error }}
      </div>

      <!-- Todo input form: Emits add-todo event when user submits -->
      <TodoForm @add-todo="addTodo" />

      <!-- Todo list display: Receives todos via props, emits events for toggle and delete -->
      <TodoList
        :todos="todos"
        @toggle-todo="toggleTodo"
        @delete-todo="deleteTodo"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import WelcomeDisplay from './components/WelcomeDisplay.vue'
import InteractiveCounter from './components/InteractiveCounter.vue'
import TodoForm from './components/TodoForm.vue'
import TodoList from './components/TodoList.vue'
import { fetchTodos, createTodo, updateTodo, deleteTodo as deleteTodoAPI } from './services/todoService'

// State management: Reactive todos state initialized as empty array
const todos = ref([])

// Loading and error state for API calls
const loading = ref(false)
const error = ref(null)

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

// Event handler: Adds new todo via API when TodoForm emits add-todo event
// Data flow: TodoForm -> emit('add-todo') -> addTodo handler -> API call -> modify todos state -> TodoList re-renders
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

// Event handler: Removes todo via API when TodoList emits delete-todo event
// Data flow: TodoList -> emit('delete-todo') -> deleteTodo handler -> API call -> modify todos state -> TodoList re-renders
const deleteTodo = async (id) => {
  loading.value = true
  error.value = null
  try {
    await deleteTodoAPI(id)
    todos.value = todos.value.filter(todo => todo.id !== id)
  } catch (err) {
    error.value = 'Failed to delete todo'
    console.error(err)
  } finally {
    loading.value = false
  }
}

// Event handler: Toggles todo completed status via API when TodoList emits toggle-todo event
// Data flow: TodoList -> emit('toggle-todo') -> toggleTodo handler -> API call -> modify todos state -> TodoList re-renders
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
</script>

<style>
</style>
