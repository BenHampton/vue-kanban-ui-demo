import { describe, it, expect } from 'vitest'
import { mount, RouterLinkStub } from '@vue/test-utils'
import TaskCard from '@/components/TaskCard.vue'
import type { Task } from '@/types/task'

const task: Task = {
  id: 't1',
  title: 'Write tests',
  description: 'Cover the store and card',
  status: 'todo',
  order: 0,
  createdAt: '2026-01-01T00:00:00.000Z',
}

function mountCard() {
  return mount(TaskCard, {
    props: { task },
    global: { stubs: { RouterLink: RouterLinkStub } },
  })
}

describe('TaskCard', () => {
  it('renders the title as a link to the task detail route', () => {
    const wrapper = mountCard()
    const link = wrapper.findComponent(RouterLinkStub)
    expect(link.text()).toContain('Write tests')
    expect(link.props('to')).toEqual({ name: 'task', params: { id: 't1' } })
  })

  it('emits edit with the task id', async () => {
    const wrapper = mountCard()
    await wrapper.get('button[title="Edit"]').trigger('click')
    expect(wrapper.emitted('edit')).toEqual([['t1']])
  })

  it('emits delete with the task id', async () => {
    const wrapper = mountCard()
    await wrapper.get('button[title="Delete"]').trigger('click')
    expect(wrapper.emitted('delete')).toEqual([['t1']])
  })
})
