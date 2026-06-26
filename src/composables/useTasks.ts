import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { tasksApi } from '@/api/tasks'
import type { NewTaskInput, Task, TaskPatch } from '@/types/task.ts'

const KEYS = { all: ['tasks'] as const }

export function useTasksQuery() {
  return useQuery({
    queryKey: KEYS.all,
    queryFn: tasksApi.list,
    staleTime: 10_000, // treat data fresh for 10s; no refetch storm
  })
}

export function useCreateTask() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: NewTaskInput) => tasksApi.create(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.all }),
  })
}

export function useDeleteTask() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => tasksApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.all }),
  })
}

export function useUpdateTask() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: TaskPatch }) => tasksApi.update(id, patch),

    // 1. onMutate runs BEFORE the request. Apply the change to the cache now.
    onMutate: async ({ id, patch }) => {
      await qc.cancelQueries({ queryKey: KEYS.all }) // stop in-flight refetches
      const previous = qc.getQueryData<Task[]>(KEYS.all) // snapshot for rollback
      qc.setQueryData<Task[]>(KEYS.all, (old) =>
        (old ?? []).map((t) => (t.id === id ? { ...t, ...patch } : t)),
      )
      return { previous } // becomes `context` below
    },

    // 2. onError runs if the request fails. Roll back to the snapshot.
    onError: (_err, _vars, context) => {
      if (context?.previous) qc.setQueryData(KEYS.all, context.previous)
    },

    // 3. onSettled runs always (success OR error). Re-sync with the server.
    onSettled: () => qc.invalidateQueries({ queryKey: KEYS.all }),
  })
}
