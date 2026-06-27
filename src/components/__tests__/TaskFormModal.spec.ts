import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TaskFormModal from '@/components/TaskFormModal.vue'
import type { Task } from '@/types/task'

const task: Task = {
  id: 't1',
  title: 'Edit me',
  description: 'a description',
  status: 'in_progress',
  order: 0,
  createdAt: '2026-01-01T00:00:00.000Z',
}

describe('TaskFormModal', () => {
  it('starts empty in create mode', () => {
    const wrapper = mount(TaskFormModal, { props: { task: null } })
    expect(wrapper.get('h3').text()).toBe('New task')
    expect((wrapper.get('input[type="text"]').element as HTMLInputElement).value).toBe('')
    expect((wrapper.get('textarea').element as HTMLTextAreaElement).value).toBe('')
  })

  it('prefills fields when editing an existing task', () => {
    const wrapper = mount(TaskFormModal, { props: { task } })
    expect(wrapper.get('h3').text()).toBe('Edit task')
    expect((wrapper.get('input[type="text"]').element as HTMLInputElement).value).toBe('Edit me')
    expect((wrapper.get('textarea').element as HTMLTextAreaElement).value).toBe('a description')
    expect((wrapper.get('select').element as HTMLSelectElement).value).toBe('in_progress')
  })

  it('emits submit with trimmed field values', async () => {
    const wrapper = mount(TaskFormModal, { props: { task: null } })
    await wrapper.get('input[type="text"]').setValue('  New title  ')
    await wrapper.get('textarea').setValue('  details  ')
    await wrapper.findAll('button')[1]!.trigger('click') // primary "Create"

    expect(wrapper.emitted('submit')).toEqual([
      [{ title: 'New title', description: 'details', status: 'todo' }],
    ])
  })

  it('does not emit submit when the title is blank', async () => {
    const wrapper = mount(TaskFormModal, { props: { task: null } })
    await wrapper.get('input[type="text"]').setValue('   ')
    await wrapper.findAll('button')[1]!.trigger('click')

    expect(wrapper.emitted('submit')).toBeUndefined()
  })

  it('emits close when cancel is clicked', async () => {
    const wrapper = mount(TaskFormModal, { props: { task: null } })
    await wrapper.findAll('button')[0]!.trigger('click') // ghost "Cancel"

    expect(wrapper.emitted('close')).toHaveLength(1)
  })
})
