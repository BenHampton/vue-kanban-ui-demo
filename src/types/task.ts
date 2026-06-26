export type TaskStatus = 'todo' | 'in_progress' | 'done'

export interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  order: number // column order
  createdAt: string // ISO string
}

export type NewTaskInput = Pick<Task, 'title' | 'description' | 'status'>

export type TaskPatch = Partial<Pick<Task, 'title' | 'description' | 'status' | 'order'>>

export const STATUSES: { value: TaskStatus; label: string }[] = [
  { value: 'todo', label: 'Todo' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
]
