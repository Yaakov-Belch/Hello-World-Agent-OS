import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import App from '../App.vue'

describe('App.vue - Todo State Management with API', () => {
  beforeEach(() => {
    // Mock fetch API for all tests
    global.fetch = vi.fn()
  })

  it('initializes todos state as empty array', async () => {
    // Mock fetchTodos to return empty array
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ todos: [] })
    })

    const wrapper = mount(App)
    await flushPromises()

    // Verify TodoList receives empty todos array initially
    const todoList = wrapper.findComponent({ name: 'TodoList' })
    expect(todoList.props('todos')).toEqual([])
  })

  it('generates unique IDs for each todo', async () => {
    // Mock initial fetch
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ todos: [] })
    })

    const wrapper = mount(App)
    await flushPromises()

    // Mock createTodo responses
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ todo: { id: 1, text: 'First todo', completed: false, created_at: Date.now() } })
    })

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ todo: { id: 2, text: 'Second todo', completed: false, created_at: Date.now() } })
    })

    const todoForm = wrapper.findComponent({ name: 'TodoForm' })

    // Add two todos
    await todoForm.vm.$emit('add-todo', 'First todo')
    await flushPromises()

    await todoForm.vm.$emit('add-todo', 'Second todo')
    await flushPromises()

    // Verify unique IDs
    const todoList = wrapper.findComponent({ name: 'TodoList' })
    const todos = todoList.props('todos')

    expect(todos[0].id).toBe(1)
    expect(todos[1].id).toBe(2)
    expect(todos[0].id).not.toBe(todos[1].id)
  })

  it('adds todo through TodoForm and updates state correctly', async () => {
    // Mock initial fetch
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ todos: [] })
    })

    const wrapper = mount(App)
    await flushPromises()

    // Mock createTodo
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ todo: { id: 1, text: 'New test todo', completed: false, created_at: Date.now() } })
    })

    const todoForm = wrapper.findComponent({ name: 'TodoForm' })

    // Emit add-todo event from TodoForm
    await todoForm.vm.$emit('add-todo', 'New test todo')
    await flushPromises()

    // Verify state was updated
    const todoList = wrapper.findComponent({ name: 'TodoList' })
    const todos = todoList.props('todos')

    expect(todos.length).toBe(1)
    expect(todos[0].text).toBe('New test todo')
    expect(todos[0].completed).toBe(false)
  })

  it('deletes todo and removes item from state', async () => {
    // Mock initial fetch
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ todos: [] })
    })

    const wrapper = mount(App)
    await flushPromises()

    // Mock createTodo
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ todo: { id: 1, text: 'Todo to delete', completed: false, created_at: Date.now() } })
    })

    const todoForm = wrapper.findComponent({ name: 'TodoForm' })

    // Add a todo first
    await todoForm.vm.$emit('add-todo', 'Todo to delete')
    await flushPromises()

    // Get the todo id
    const todoList = wrapper.findComponent({ name: 'TodoList' })
    const todoId = todoList.props('todos')[0].id

    // Mock deleteTodo
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Todo deleted successfully' })
    })

    // Emit delete-todo event
    await todoList.vm.$emit('delete-todo', todoId)
    await flushPromises()

    // Verify todo was removed from state
    expect(todoList.props('todos').length).toBe(0)
  })

  it('toggles todo completed status', async () => {
    // Mock initial fetch
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ todos: [] })
    })

    const wrapper = mount(App)
    await flushPromises()

    // Mock createTodo
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ todo: { id: 1, text: 'Todo to toggle', completed: false, created_at: Date.now() } })
    })

    const todoForm = wrapper.findComponent({ name: 'TodoForm' })

    // Add a todo
    await todoForm.vm.$emit('add-todo', 'Todo to toggle')
    await flushPromises()

    // Get the todo id
    const todoList = wrapper.findComponent({ name: 'TodoList' })
    const todoId = todoList.props('todos')[0].id

    // Verify initially not completed
    expect(todoList.props('todos')[0].completed).toBe(false)

    // Mock updateTodo - toggle to true
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ todo: { id: 1, text: 'Todo to toggle', completed: true, created_at: Date.now() } })
    })

    // Emit toggle-todo event
    await todoList.vm.$emit('toggle-todo', todoId)
    await flushPromises()

    // Verify completed status toggled to true
    expect(todoList.props('todos')[0].completed).toBe(true)

    // Mock updateTodo - toggle back to false
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ todo: { id: 1, text: 'Todo to toggle', completed: false, created_at: Date.now() } })
    })

    // Toggle again
    await todoList.vm.$emit('toggle-todo', todoId)
    await flushPromises()

    // Verify completed status toggled back to false
    expect(todoList.props('todos')[0].completed).toBe(false)
  })

  it('propagates state changes to TodoList component', async () => {
    // Mock initial fetch
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ todos: [] })
    })

    const wrapper = mount(App)
    await flushPromises()

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

    const todoForm = wrapper.findComponent({ name: 'TodoForm' })

    // Add multiple todos
    await todoForm.vm.$emit('add-todo', 'First todo')
    await flushPromises()

    await todoForm.vm.$emit('add-todo', 'Second todo')
    await flushPromises()

    await todoForm.vm.$emit('add-todo', 'Third todo')
    await flushPromises()

    // Verify all todos are in state and propagated to TodoList
    const todoList = wrapper.findComponent({ name: 'TodoList' })
    const todos = todoList.props('todos')

    expect(todos.length).toBe(3)
    expect(todos[0].text).toBe('First todo')
    expect(todos[1].text).toBe('Second todo')
    expect(todos[2].text).toBe('Third todo')
  })

  it('maintains todo order with newest last', async () => {
    // Mock initial fetch
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ todos: [] })
    })

    const wrapper = mount(App)
    await flushPromises()

    // Mock createTodo for multiple todos
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ todo: { id: 1, text: 'First', completed: false, created_at: Date.now() } })
    })

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ todo: { id: 2, text: 'Second', completed: false, created_at: Date.now() } })
    })

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ todo: { id: 3, text: 'Third', completed: false, created_at: Date.now() } })
    })

    const todoForm = wrapper.findComponent({ name: 'TodoForm' })

    // Add todos in sequence
    await todoForm.vm.$emit('add-todo', 'First')
    await flushPromises()

    await todoForm.vm.$emit('add-todo', 'Second')
    await flushPromises()

    await todoForm.vm.$emit('add-todo', 'Third')
    await flushPromises()

    const todoList = wrapper.findComponent({ name: 'TodoList' })
    const todos = todoList.props('todos')

    // Verify newest appears last
    expect(todos[todos.length - 1].text).toBe('Third')
  })
})
