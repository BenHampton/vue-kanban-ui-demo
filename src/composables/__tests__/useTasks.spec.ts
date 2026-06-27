import { afterEach, describe, expect, it, vi } from 'vitest'
import { createApp } from 'vue'
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import { flushPromises } from '@vue/test-utils'
import { useCreateTask, useDeleteTask, useUpdateTask } from '@/composables/useTasks'
import { tasksApi } from '@/api/tasks'
import type { Task } from '@/types/task'

// The composables wrap the HTTP layer; mock it so we can assert cache behaviour.
vi.mock('@/api/tasks', () => ({
  tasksApi: {
    list: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  },
}))

const TASKS: Task[] = [
  { id: 't1', title: 'A', description: '', status: 'todo', order: 0, createdAt: '2026-01-01T00:00:00.000Z' },
  { id: 't2', title: 'B', description: '', status: 'todo', order: 1, createdAt: '2026-01-02T00:00:00.000Z' },
]

const clone = () => TASKS.map((t) => ({ ...t }))

function makeClient() {
  return new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
}

// Run a composable inside a component that has Vue Query installed,
// so useMutation/useQueryClient resolve against `queryClient`.
function withQuery<T>(composable: () => T, queryClient: QueryClient): T {
  let result!: T
  const app = createApp({
    setup() {
      result = composable()
      return () => null
    },
  })
  app.use(VueQueryPlugin, { queryClient })
  app.mount(document.createElement('div'))
  return result
}

afterEach(() => {
  vi.clearAllMocks()
})

describe('useUpdateTask (optimistic)', () => {
  it('applies the patch to the cache before the request resolves', async () => {
    const qc = makeClient()
    qc.setQueryData(['tasks'], clone())
    // Keep the request pending so onSettled never runs during the assertion.
    vi.mocked(tasksApi.update).mockReturnValue(new Promise<Task>(() => {}))

    const update = withQuery(() => useUpdateTask(), qc)
    update.mutate({ id: 't1', patch: { status: 'done' } })
    await flushPromises()

    const cached = qc.getQueryData<Task[]>(['tasks'])!
    expect(cached.find((t) => t.id === 't1')!.status).toBe('done')
    expect(tasksApi.update).toHaveBeenCalledWith('t1', { status: 'done' })
  })

  it('rolls the cache back to the snapshot when the request fails', async () => {
    const qc = makeClient()
    qc.setQueryData(['tasks'], clone())
    vi.mocked(tasksApi.update).mockRejectedValue(new Error('boom'))
    // Keep any invalidation refetch pending so it can't mask the rollback.
    vi.mocked(tasksApi.list).mockReturnValue(new Promise<Task[]>(() => {}))

    const update = withQuery(() => useUpdateTask(), qc)
    await update.mutateAsync({ id: 't1', patch: { status: 'done' } }).catch(() => {})
    await flushPromises()

    const cached = qc.getQueryData<Task[]>(['tasks'])!
    expect(cached.find((t) => t.id === 't1')!.status).toBe('todo')
  })
})

describe('useCreateTask', () => {
  it('creates via the api and invalidates the list', async () => {
    const qc = makeClient()
    const invalidate = vi.spyOn(qc, 'invalidateQueries')
    const created: Task = {
      id: 't3', title: 'C', description: '', status: 'todo', order: 2, createdAt: '2026-01-03T00:00:00.000Z',
    }
    vi.mocked(tasksApi.create).mockResolvedValue(created)

    const create = withQuery(() => useCreateTask(), qc)
    await create.mutateAsync({ title: 'C', description: '', status: 'todo' })
    await flushPromises()

    expect(tasksApi.create).toHaveBeenCalledWith({ title: 'C', description: '', status: 'todo' })
    expect(invalidate).toHaveBeenCalledWith({ queryKey: ['tasks'] })
  })
})

describe('useDeleteTask', () => {
  it('removes via the api and invalidates the list', async () => {
    const qc = makeClient()
    const invalidate = vi.spyOn(qc, 'invalidateQueries')
    vi.mocked(tasksApi.remove).mockResolvedValue(undefined)

    const remove = withQuery(() => useDeleteTask(), qc)
    await remove.mutateAsync('t1')
    await flushPromises()

    expect(tasksApi.remove).toHaveBeenCalledWith('t1')
    expect(invalidate).toHaveBeenCalledWith({ queryKey: ['tasks'] })
  })
})
