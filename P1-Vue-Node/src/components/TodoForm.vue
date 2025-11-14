<template>
  <form @submit.prevent="handleSubmit" class="flex flex-col gap-3">
    <!-- Input field container with validation state -->
    <div class="flex gap-2">
      <!-- Text input field: v-model creates two-way binding to todoText reactive ref -->
      <input
        v-model="todoText"
        @input="clearError"
        type="text"
        placeholder="Enter a new todo..."
        class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        :class="errorMessage ? 'border-red-500' : 'border-gray-300'"
      />

      <!-- Submit button: Styled following InteractiveCounter.vue patterns -->
      <button
        type="submit"
        class="px-6 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 active:bg-blue-700 transition-colors font-medium"
      >
        Add Todo
      </button>
    </div>

    <!-- Validation error message: Displays when errorMessage has a value -->
    <div v-if="errorMessage" class="text-red-500 text-sm">
      {{ errorMessage }}
    </div>
  </form>
</template>

<script setup>
import { ref } from 'vue'

// Reactive state for input field binding - tracks the user's todo text input
const todoText = ref('')

// Reactive state for validation error messages - manages error display state
const errorMessage = ref('')

// Form submission handler: Validates input and emits event to parent component
const handleSubmit = () => {
  // Trim whitespace from user input to prevent empty submissions
  const trimmedText = todoText.value.trim()

  // Validation: Check if trimmed text is empty
  if (!trimmedText) {
    errorMessage.value = 'Todo cannot be empty'
    return
  }

  // Emit custom event 'add-todo' with trimmed text payload to parent (App.vue)
  // This follows the "props down, events up" communication pattern
  emit('add-todo', trimmedText)

  // Clear input field after successful submission
  todoText.value = ''

  // Clear any existing error message
  errorMessage.value = ''
}

// Reactive error clearing: Removes error state when user starts typing
const clearError = () => {
  if (errorMessage.value) {
    errorMessage.value = ''
  }
}

// Define custom events that this component can emit
const emit = defineEmits(['add-todo'])
</script>

<style>
</style>
