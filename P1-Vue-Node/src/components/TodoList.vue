<template>
  <div class="w-full max-w-2xl">
    <!-- Empty state: Displayed when todos array is empty -->
    <div v-if="todos.length === 0" class="text-center text-gray-400 py-8">
      No todos yet. Add one to get started!
    </div>

    <!-- Todo list: Displayed when todos array has items -->
    <div v-else class="flex flex-col gap-3">
      <!-- v-for directive renders each todo with :key binding for efficient updates -->
      <div
        v-for="todo in todos"
        :key="todo.id"
        class="flex items-center justify-between gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
      >
        <!-- Left section: Checkbox and todo text -->
        <div class="flex items-center gap-3 flex-1">
          <!-- Completion toggle checkbox: Emits toggle-todo event with todo id -->
          <input
            type="checkbox"
            :checked="todo.completed"
            @change="handleToggle(todo.id)"
            class="w-5 h-5 text-blue-500 cursor-pointer"
          />

          <!-- Todo text: Conditional styling based on completed status -->
          <!-- Completed todos display with strikethrough and muted color -->
          <span
            :class="{
              'line-through text-gray-400': todo.completed,
              'text-gray-800': !todo.completed
            }"
            class="text-lg"
          >
            {{ todo.text }}
          </span>
        </div>

        <!-- Right section: Delete button -->
        <!-- Delete button: Emits delete-todo event with todo id -->
        <button
          @click="handleDelete(todo.id)"
          class="px-4 py-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors font-medium"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
// Define component props: Accepts todos array from parent component
// Each todo object structure: { id, text, completed, created_at }
const props = defineProps({
  todos: {
    type: Array,
    default: () => []
  }
})

// Define custom events that this component can emit to parent (App.vue)
const emit = defineEmits(['toggle-todo', 'delete-todo'])

// Event handler: Emits toggle-todo event with todo id to parent component
// Parent will update the completed status in state
const handleToggle = (id) => {
  emit('toggle-todo', id)
}

// Event handler: Emits delete-todo event with todo id to parent component
// Parent will remove the todo from state
const handleDelete = (id) => {
  emit('delete-todo', id)
}
</script>

<style>
</style>
