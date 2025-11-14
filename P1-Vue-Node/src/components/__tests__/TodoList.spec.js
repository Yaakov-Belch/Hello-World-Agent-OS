import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TodoList from '../TodoList.vue'

describe('TodoList', () => {
  it('renders todos array correctly', () => {
    const todos = [
      { id: 1, text: 'First todo', completed: false, timestamp: Date.now() },
      { id: 2, text: 'Second todo', completed: true, timestamp: Date.now() }
    ]

    const wrapper = mount(TodoList, {
      props: { todos }
    })

    // Verify both todos are rendered
    expect(wrapper.text()).toContain('First todo')
    expect(wrapper.text()).toContain('Second todo')
  })

  it('renders correct number of items with proper keys', () => {
    const todos = [
      { id: 1, text: 'Todo 1', completed: false, timestamp: Date.now() },
      { id: 2, text: 'Todo 2', completed: false, timestamp: Date.now() },
      { id: 3, text: 'Todo 3', completed: false, timestamp: Date.now() }
    ]

    const wrapper = mount(TodoList, {
      props: { todos }
    })

    // Verify correct number of todo items rendered
    const todoItems = wrapper.findAll('[class*="flex items-center justify-between"]')
    expect(todoItems.length).toBe(3)
  })

  it('emits delete-todo event with correct id when delete button clicked', async () => {
    const todos = [
      { id: 42, text: 'Test todo', completed: false, timestamp: Date.now() }
    ]

    const wrapper = mount(TodoList, {
      props: { todos }
    })

    // Click delete button
    await wrapper.find('button').trigger('click')

    // Verify delete-todo event was emitted with correct id
    expect(wrapper.emitted('delete-todo')).toBeTruthy()
    expect(wrapper.emitted('delete-todo')[0]).toEqual([42])
  })

  it('emits toggle-todo event with correct id when checkbox clicked', async () => {
    const todos = [
      { id: 99, text: 'Test todo', completed: false, timestamp: Date.now() }
    ]

    const wrapper = mount(TodoList, {
      props: { todos }
    })

    // Click checkbox
    await wrapper.find('input[type="checkbox"]').trigger('change')

    // Verify toggle-todo event was emitted with correct id
    expect(wrapper.emitted('toggle-todo')).toBeTruthy()
    expect(wrapper.emitted('toggle-todo')[0]).toEqual([99])
  })

  it('displays completed todos with strikethrough styling', () => {
    const todos = [
      { id: 1, text: 'Active todo', completed: false, timestamp: Date.now() },
      { id: 2, text: 'Completed todo', completed: true, timestamp: Date.now() }
    ]

    const wrapper = mount(TodoList, {
      props: { todos }
    })

    // Find all todo text spans
    const spans = wrapper.findAll('span')

    // Find the completed todo span
    const completedSpan = spans.find(span => span.text() === 'Completed todo')

    // Verify strikethrough class is applied
    expect(completedSpan.classes()).toContain('line-through')
    expect(completedSpan.classes()).toContain('text-gray-400')
  })

  it('displays empty state message when todos array is empty', () => {
    const wrapper = mount(TodoList, {
      props: { todos: [] }
    })

    // Verify empty state message is displayed
    expect(wrapper.text()).toContain('No todos yet')
  })
})
