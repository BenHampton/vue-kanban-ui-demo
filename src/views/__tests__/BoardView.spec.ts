import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import { mount, flushPromises } from '@vue/test-utils'
import BoardView from '@/views/BoardView.vue'
import BoardColumn from '@/components/BoardColumn.vue'
import { useBoardUiStore } from '@/stores/boardUi'
import {
  useTasksQuery,
  useCreateTask,
  useUpdateTask,
  useDeleteTask,
} from '@/composables/useTasks'
import type { Task } from '@/types/task'

// Isolate BoardView from Vue Query — drive it with controlled data instead.
vi.mock('@/composables/useTasks', () => ({
  useTasksQuery: vi.fn(),
  useCreateTask: vi.fn(),
  useUpdateTask: vi.fn(),
  useDeleteTask: vi.fn(),
}))

const TASKS: Task[] = [
  { id: 't1', title: 'Alpha', description: '', status: 'todo', order: 1, createdAt: '2026-01-01T00:00:00.000Z' },
  { id: 't2', title: 'Beta', description: '', status: 'todo', order: 0, createdAt: '2026-01-02T00:00:00.000Z' },
  { id: 't3', title: 'Gamma', description: '', status: 'in_progress', order: 0, createdAt: '2026-01-03T00:00:00.000Z' },
  { id: 't4', title: 'Delta', description: '', status: 'done', order: 0, createdAt: '2026-01-04T00:00:00.000Z' },
]

type QueryReturn = ReturnType<typeof useTasksQuery>

function mountBoard() {
  const pinia = createPinia()
  setActivePinia(pinia)
  const ui = useBoardUiStore()
  const wrapper = mount(BoardView, {
    global: {
      plugins: [pinia],
      stubs: { BoardColumn: true, TaskFormModal: true, BaseButton: true },
    },
  })
  return { wrapper, ui }
}

function column(wrapper: ReturnType<typeof mountBoard>['wrapper'], status: string) {
  return wrapper
    .findAllComponents(BoardColumn)
    .find((c) => c.props('status') === status)!
}

function idsIn(wrapper: ReturnType<typeof mountBoard>['wrapper'], status: string) {
  return (column(wrapper, status).props('tasks') as Task[]).map((t) => t.id)
}

beforeEach(() => {
  vi.mocked(useTasksQuery).mockReturnValue({
    data: ref(TASKS),
    isLoading: ref(false),
    isError: ref(false),
  } as unknown as QueryReturn)
  const mutation = { mutate: vi.fn() }
  vi.mocked(useCreateTask).mockReturnValue(mutation as unknown as ReturnType<typeof useCreateTask>)
  vi.mocked(useUpdateTask).mockReturnValue(mutation as unknown as ReturnType<typeof useUpdateTask>)
  vi.mocked(useDeleteTask).mockReturnValue(mutation as unknown as ReturnType<typeof useDeleteTask>)
})

describe('BoardView grouping', () => {
  it('renders one column per status', () => {
    const { wrapper } = mountBoard()
    expect(wrapper.findAllComponents(BoardColumn)).toHaveLength(3)
  })

  it('groups tasks by status and sorts each column by order', () => {
    const { wrapper } = mountBoard()
    expect(idsIn(wrapper, 'todo')).toEqual(['t2', 't1']) // order 0 before order 1
    expect(idsIn(wrapper, 'in_progress')).toEqual(['t3'])
    expect(idsIn(wrapper, 'done')).toEqual(['t4'])
  })
})

describe('BoardView filtering', () => {
  it('filters by case-insensitive title search', async () => {
    const { wrapper, ui } = mountBoard()
    ui.search = 'alp'
    await flushPromises()
    expect(idsIn(wrapper, 'todo')).toEqual(['t1'])
    expect(idsIn(wrapper, 'in_progress')).toEqual([])
    expect(idsIn(wrapper, 'done')).toEqual([])
  })

  it('filters by status', async () => {
    const { wrapper, ui } = mountBoard()
    ui.statusFilter = 'done'
    await flushPromises()
    expect(idsIn(wrapper, 'todo')).toEqual([])
    expect(idsIn(wrapper, 'done')).toEqual(['t4'])
  })
})
