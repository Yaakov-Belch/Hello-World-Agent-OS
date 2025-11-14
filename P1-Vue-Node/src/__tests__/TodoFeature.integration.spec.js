import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import App from '../App.vue'

describe('Todo Feature - End-to-End Integration Tests with API', () => {
  let todoIdCounter = 1

  beforeEach(() => {
    // Mock fetch API for all tests
    global.fetch = vi.fn()
    todoIdCounter = 1
  })

  it('completes full workflow: add -> display -> toggle -> delete', async () => {
    // Mock initial fetch
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ todos: [] })
    })

    const wrapper = mount(App)
    await flushPromises()

    // Find components
    const todoForm = wrapper.findComponent({ name: 'TodoForm' })
    const todoList = wrapper.findComponent({ name: 'TodoList' })

    // Step 1: Add todo
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ todo: { id: 1, text: 'Complete workflow test', completed: false, created_at: Date.now() } })
    })

    await todoForm.vm.$emit('add-todo', 'Complete workflow test')
    await flushPromises()

    // Step 2: Verify display
    let todos = todoList.props('todos')
    expect(todos.length).toBe(1)
    expect(todos[0].text).toBe('Complete workflow test')
    expect(todos[0].completed).toBe(false)

    // Step 3: Toggle completion
    const todoId = todos[0].id
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ todo: { id: 1, text: 'Complete workflow test', completed: true, created_at: Date.now() } })
    })

    await todoList.vm.$emit('toggle-todo', todoId)
    await flushPromises()

    todos = todoList.props('todos')
    expect(todos[0].completed).toBe(true)

    // Step 4: Delete todo
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Todo deleted successfully' })
    })

    await todoList.vm.$emit('delete-todo', todoId)
    await flushPromises()

    todos = todoList.props('todos')
    expect(todos.length).toBe(0)
  })

  it('completes validation flow: empty submit -> error -> type text -> error clears -> submit successfully', async () => {
    // Mock initial fetch
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ todos: [] })
    })

    const wrapper = mount(App)
    await flushPromises()

    const input = wrapper.find('input[type="text"]')
    const form = wrapper.find('form')

    // Step 1: Attempt empty submission
    await form.trigger('submit.prevent')

    // Step 2: Verify error displays
    expect(wrapper.text()).toContain('Todo cannot be empty')
    expect(input.classes()).toContain('border-red-500')

    // Step 3: Start typing
    await input.setValue('Valid todo text')

    // Step 4: Verify error clears
    expect(wrapper.find('.text-red-500').exists()).toBe(false)

    // Step 5: Submit successfully
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ todo: { id: 1, text: 'Valid todo text', completed: false, created_at: Date.now() } })
    })

    await form.trigger('submit.prevent')
    await flushPromises()

    // Step 6: Verify todo was added
    const todoList = wrapper.findComponent({ name: 'TodoList' })
    const todos = todoList.props('todos')
    expect(todos.length).toBe(1)
    expect(todos[0].text).toBe('Valid todo text')
  })

  it('maintains correct order when adding multiple todos', async () => {
    // Mock initial fetch
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ todos: [] })
    })

    const wrapper = mount(App)
    await flushPromises()

    const todoForm = wrapper.findComponent({ name: 'TodoForm' })

    // Mock createTodo for multiple todos
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ todo: { id: 1, text: 'First todo', completed: false, created_at: Date.now() } })
    })

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ todo: { id: 2, text: 'Second todo', completed: false, created_at: Date.now() } })
    })

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ todo: { id: 3, text: 'Third todo', completed: false, created_at: Date.now() } })
    })

    // Add multiple todos
    await todoForm.vm.$emit('add-todo', 'First todo')
    await flushPromises()

    await todoForm.vm.$emit('add-todo', 'Second todo')
    await flushPromises()

    await todoForm.vm.$emit('add-todo', 'Third todo')
    await flushPromises()

    const todoList = wrapper.findComponent({ name: 'TodoList' })
    const todos = todoList.props('todos')

    // Verify order (newest last)
    expect(todos.length).toBe(3)
    expect(todos[0].text).toBe('First todo')
    expect(todos[1].text).toBe('Second todo')
    expect(todos[2].text).toBe('Third todo')
  })

  it('deletes middle item and verifies list updates correctly', async () => {
    // Mock initial fetch
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ todos: [] })
    })

    const wrapper = mount(App)
    await flushPromises()

    const todoForm = wrapper.findComponent({ name: 'TodoForm' })

    // Mock createTodo for three todos
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ todo: { id: 1, text: 'First', completed: false, created_at: Date.now() } })
    })

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ todo: { id: 2, text: 'Middle', completed: false, created_at: Date.now() } })
    })

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ todo: { id: 3, text: 'Last', completed: false, created_at: Date.now() } })
    })

    // Add three todos
    await todoForm.vm.$emit('add-todo', 'First')
    await flushPromises()

    await todoForm.vm.$emit('add-todo', 'Middle')
    await flushPromises()

    await todoForm.vm.$emit('add-todo', 'Last')
    await flushPromises()

    const todoList = wrapper.findComponent({ name: 'TodoList' })
    let todos = todoList.props('todos')

    // Delete middle item
    const middleId = todos[1].id

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Todo deleted successfully' })
    })

    await todoList.vm.$emit('delete-todo', middleId)
    await flushPromises()

    // Verify correct item was deleted and others remain
    todos = todoList.props('todos')
    expect(todos.length).toBe(2)
    expect(todos[0].text).toBe('First')
    expect(todos[1].text).toBe('Last')
  })

  it('maintains completed status through multiple operations', async () => {
    // Mock initial fetch
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ todos: [] })
    })

    const wrapper = mount(App)
    await flushPromises()

    const todoForm = wrapper.findComponent({ name: 'TodoForm' })

    // Mock createTodo for two todos
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ todo: { id: 1, text: 'Todo 1', completed: false, created_at: Date.now() } })
    })

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ todo: { id: 2, text: 'Todo 2', completed: false, created_at: Date.now() } })
    })

    // Add two todos
    await todoForm.vm.$emit('add-todo', 'Todo 1')
    await flushPromises()

    await todoForm.vm.$emit('add-todo', 'Todo 2')
    await flushPromises()

    const todoList = wrapper.findComponent({ name: 'TodoList' })
    let todos = todoList.props('todos')

    const todo1Id = todos[0].id
    const todo2Id = todos[1].id

    // Mark first todo as completed
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ todo: { id: 1, text: 'Todo 1', completed: true, created_at: Date.now() } })
    })

    await todoList.vm.$emit('toggle-todo', todo1Id)
    await flushPromises()

    todos = todoList.props('todos')

    // Verify first is completed, second is not
    expect(todos[0].completed).toBe(true)
    expect(todos[1].completed).toBe(false)

    // Add another todo
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ todo: { id: 3, text: 'Todo 3', completed: false, created_at: Date.now() } })
    })

    await todoForm.vm.$emit('add-todo', 'Todo 3')
    await flushPromises()

    todos = todoList.props('todos')

    // Verify completed status persisted
    expect(todos[0].completed).toBe(true)
    expect(todos[1].completed).toBe(false)
    expect(todos[2].completed).toBe(false)

    // Delete the second todo
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Todo deleted successfully' })
    })

    await todoList.vm.$emit('delete-todo', todo2Id)
    await flushPromises()

    todos = todoList.props('todos')

    // Verify first todo still completed
    expect(todos[0].completed).toBe(true)
  })

  it('displays empty state and hides it when todos added', async () => {
    // Mock initial fetch
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ todos: [] })
    })

    const wrapper = mount(App)
    await flushPromises()

    // Verify empty state displays initially
    expect(wrapper.text()).toContain('No todos yet')

    // Add a todo
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ todo: { id: 1, text: 'First todo', completed: false, created_at: Date.now() } })
    })

    const todoForm = wrapper.findComponent({ name: 'TodoForm' })
    await todoForm.vm.$emit('add-todo', 'First todo')
    await flushPromises()

    // Verify empty state is hidden
    expect(wrapper.text()).not.toContain('No todos yet')
    expect(wrapper.text()).toContain('First todo')
  })

  it('shows empty state again after all todos deleted', async () => {
    // Mock initial fetch
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ todos: [] })
    })

    const wrapper = mount(App)
    await flushPromises()

    const todoForm = wrapper.findComponent({ name: 'TodoForm' })

    // Add a todo
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ todo: { id: 1, text: 'Temporary todo', completed: false, created_at: Date.now() } })
    })

    await todoForm.vm.$emit('add-todo', 'Temporary todo')
    await flushPromises()

    // Verify todo displays
    expect(wrapper.text()).toContain('Temporary todo')

    // Delete the todo
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Todo deleted successfully' })
    })

    const todoList = wrapper.findComponent({ name: 'TodoList' })
    const todoId = todoList.props('todos')[0].id
    await todoList.vm.$emit('delete-todo', todoId)
    await flushPromises()

    // Verify empty state returns
    expect(wrapper.text()).toContain('No todos yet')
  })

  it('generates unique IDs for each todo', async () => {
    // Mock initial fetch
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ todos: [] })
    })

    const wrapper = mount(App)
    await flushPromises()

    const todoForm = wrapper.findComponent({ name: 'TodoForm' })

    // Mock createTodo with unique IDs
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ todo: { id: 1, text: 'Todo 1', completed: false, created_at: Date.now() } })
    })

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ todo: { id: 2, text: 'Todo 2', completed: false, created_at: Date.now() } })
    })

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ todo: { id: 3, text: 'Todo 3', completed: false, created_at: Date.now() } })
    })

    // Add multiple todos rapidly
    await todoForm.vm.$emit('add-todo', 'Todo 1')
    await flushPromises()

    await todoForm.vm.$emit('add-todo', 'Todo 2')
    await flushPromises()

    await todoForm.vm.$emit('add-todo', 'Todo 3')
    await flushPromises()

    const todoList = wrapper.findComponent({ name: 'TodoList' })
    const todos = todoList.props('todos')

    // Verify all IDs are unique
    const ids = todos.map(todo => todo.id)
    const uniqueIds = new Set(ids)
    expect(uniqueIds.size).toBe(todos.length)
  })
})
