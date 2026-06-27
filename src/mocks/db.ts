import type { Task } from '@/types/task'

// Seed data. In real life this lives in Postgres; here it's an array.
let tasks: Task[] = [
  {
    id: 't1',
    title: 'Set up CI pipeline',
    description: 'GitHub Actions for lint + test',
    status: 'todo',
    order: 0,
    createdAt: '2025-01-02T09:00:00Z',
  },
  {
    id: 't2',
    title: 'Design token system',
    description: 'Dark theme palette + spacing scale',
    status: 'todo',
    order: 1,
    createdAt: '2025-01-02T10:00:00Z',
  },
  {
    id: 't3',
    title: 'Auth flow',
    description: 'OAuth + session refresh',
    status: 'in_progress',
    order: 0,
    createdAt: '2025-01-03T11:00:00Z',
  },
  {
    id: 't4',
    title: 'Board API endpoints',
    description: 'CRUD for tasks',
    status: 'in_progress',
    order: 1,
    createdAt: '2025-01-03T12:00:00Z',
  },
  {
    id: 't5',
    title: 'Repo bootstrap',
    description: 'Vite + Vue + TS scaffold',
    status: 'done',
    order: 0,
    createdAt: '2025-01-01T08:00:00Z',
  },
]

export const db = {
  all: () => [...tasks].sort((a, b) => a.order - b.order),
  find: (id: string) => tasks.find((t) => t.id === id),
  insert: (t: Task) => {
    tasks.push(t)
    return t
  },
  update: (id: string, patch: Partial<Task>) => {
    const i = tasks.findIndex((t) => t.id === id)
    const current = tasks[i]
    if (!current) return undefined
    const next = { ...current, ...patch }
    tasks[i] = next
    return next
  },
  remove: (id: string) => {
    tasks = tasks.filter((t) => t.id !== id)
  },
}
