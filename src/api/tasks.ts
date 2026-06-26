import type { NewTaskInput, Task, TaskPatch } from '@/types/task.ts'

const BASE = '/api/tasks'

async function json<T>(res: Response): Promise<T> {
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`)
  }
  return res.status === 204 ? (undefined as T) : res.json()
}

export const tasksApi = {
  list: () => {
    return fetch(BASE).then(json<Task[]>)
  },

  create: (input: NewTaskInput) =>
    fetch(BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    }).then(json<Task>),

  update: (id: string, patch: TaskPatch) =>
    fetch(`${BASE}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    }).then(json<Task>),

  remove: (id: string) => fetch(`${BASE}/${id}`, { method: 'DELETE' }).then(json<void>),
}
