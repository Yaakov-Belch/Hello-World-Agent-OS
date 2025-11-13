import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import WelcomeDisplay from '../WelcomeDisplay.vue'

describe('WelcomeDisplay', () => {
  it('renders without errors', () => {
    const wrapper = mount(WelcomeDisplay)
    expect(wrapper.exists()).toBe(true)
  })

  it('displays "Hello World!" text', () => {
    const wrapper = mount(WelcomeDisplay)
    expect(wrapper.text()).toContain('Hello World!')
  })

  it('has h1 element with text-4xl, font-bold, and text-center classes', () => {
    const wrapper = mount(WelcomeDisplay)
    const h1 = wrapper.find('h1')
    expect(h1.exists()).toBe(true)
    expect(h1.classes()).toContain('text-4xl')
    expect(h1.classes()).toContain('font-bold')
    expect(h1.classes()).toContain('text-center')
  })
})
