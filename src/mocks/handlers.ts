import { http, HttpResponse, delay } from 'msw'
import { db } from './db'
import type { NewTaskInput, Task, TaskPatch } from '@/types/task'

const latency = () => delay(Math.random() * 400 + 200) // 200–600ms

const findAllTasks = () => {
  return http.get('/api/tasks', async () => {
    await latency()
    return HttpResponse.json(db.all())
  })
}

const createTask = () => {
  return http.post('/api/tasks', async ({ request }) => {
    await latency()
    const input = (await request.json()) as NewTaskInput
    const siblings = db.all().filter((t) => t.status === input.status)
    const task: Task = {
      id: crypto.randomUUID(),
      title: input.title,
      description: input.description,
      status: input.status,
      order: siblings.length,
      createdAt: new Date().toISOString(),
    }
    db.insert(task)
    return HttpResponse.json(task, { status: 201 })
  })
}

const findTaskById = () => {
  return http.patch('/api/tasks/:id', async ({ params, request }) => {
    await latency()
    const patch = (await request.json()) as TaskPatch
    const updated = db.update(params.id as string, patch)
    if (!updated) return new HttpResponse(null, { status: 404 })
    return HttpResponse.json(updated)
  })
}

const deleteTaskById = () => {
  return http.delete('/api/tasks/:id', async ({ params }) => {
    await latency()
    db.remove(params.id as string)
    return new HttpResponse(null, { status: 204 })
  })
}
export const handlers = [findAllTasks(), findTaskById(), createTask(), deleteTaskById()]
