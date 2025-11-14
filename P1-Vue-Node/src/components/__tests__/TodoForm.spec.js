import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TodoForm from '../TodoForm.vue'

describe('TodoForm', () => {
  it('binds input field correctly with v-model', async () => {
    const wrapper = mount(TodoForm)
    const input = wrapper.find('input')

    // Type text into input
    await input.setValue('New todo item')

    // Verify v-model binding works
    expect(input.element.value).toBe('New todo item')
  })

  it('emits add-todo event with trimmed text on form submit', async () => {
    const wrapper = mount(TodoForm)
    const input = wrapper.find('input')

    // Enter text with extra whitespace
    await input.setValue('  Test todo  ')

    // Submit form
    await wrapper.find('form').trigger('submit.prevent')

    // Verify event was emitted with trimmed text
    expect(wrapper.emitted('add-todo')).toBeTruthy()
    expect(wrapper.emitted('add-todo')[0]).toEqual(['Test todo'])
  })

  it('prevents empty input submission and displays error message', async () => {
    const wrapper = mount(TodoForm)

    // Submit form with empty input
    await wrapper.find('form').trigger('submit.prevent')

    // Verify no event was emitted
    expect(wrapper.emitted('add-todo')).toBeFalsy()

    // Verify error message is displayed
    expect(wrapper.text()).toContain('Todo cannot be empty')
  })

  it('displays error message and red border for empty submission', async () => {
    const wrapper = mount(TodoForm)
    const input = wrapper.find('input')

    // Submit empty form
    await wrapper.find('form').trigger('submit.prevent')

    // Verify error message appears
    expect(wrapper.find('.text-red-500').exists()).toBe(true)
    expect(wrapper.text()).toContain('Todo cannot be empty')

    // Verify red border class is applied
    expect(input.classes()).toContain('border-red-500')
  })

  it('clears error message when user starts typing', async () => {
    const wrapper = mount(TodoForm)
    const input = wrapper.find('input')

    // Trigger error by submitting empty form
    await wrapper.find('form').trigger('submit.prevent')
    expect(wrapper.text()).toContain('Todo cannot be empty')

    // Start typing
    await input.setValue('New text')

    // Verify error message is cleared
    expect(wrapper.find('.text-red-500').exists()).toBe(false)
  })

  it('clears input field after successful submission', async () => {
    const wrapper = mount(TodoForm)
    const input = wrapper.find('input')

    // Enter text
    await input.setValue('Complete this task')

    // Submit form
    await wrapper.find('form').trigger('submit.prevent')

    // Verify input is cleared
    expect(input.element.value).toBe('')
  })
})
