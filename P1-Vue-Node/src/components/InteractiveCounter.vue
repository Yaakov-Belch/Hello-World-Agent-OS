<template>
  <div class="flex items-center justify-center gap-4">
    <!-- Decrement button: Uses @click directive to bind click events to handler function -->
    <button
      @click="decrement"
      class="px-6 py-3 text-2xl font-bold text-white bg-blue-500 rounded-lg hover:bg-blue-600 active:bg-blue-700 transition-colors"
    >
      -
    </button>

    <!-- Counter display: Shows the reactive counter value -->
    <div class="text-4xl font-bold text-center min-w-[100px]">
      {{ counter }}
    </div>

    <!-- Increment button: Uses @click directive to bind click events to handler function -->
    <button
      @click="increment"
      class="px-6 py-3 text-2xl font-bold text-white bg-blue-500 rounded-lg hover:bg-blue-600 active:bg-blue-700 transition-colors"
    >
      +
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Create reactive counter state using ref() - Vue's reactivity system tracks changes
const counter = ref(0)

// Event handler: Decrements counter by 1 (allows negative values)
const decrement = () => {
  counter.value -= 1
}

// Event handler: Increments counter by 1 (no maximum limit)
const increment = () => {
  counter.value += 1
}
</script>

<style>
</style>
