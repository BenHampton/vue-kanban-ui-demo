<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import BoardColumn from '@/components/BoardColumn.vue'
import TaskFormModal from '@/components/TaskFormModal.vue'
import BaseButton from '@/components/BaseButton.vue'
import { useBoardUiStore } from '@/stores/boardUi'
import { useTasksQuery, useCreateTask, useUpdateTask, useDeleteTask } from '@/composables/useTasks'
import { STATUSES } from '@/types/task'
import type { NewTaskInput, TaskStatus } from '@/types/task'

// --- SERVER STATE (TanStack Query) ---
const { data: tasks, isLoading, isError } = useTasksQuery()
const createTask = useCreateTask()
const updateTask = useUpdateTask()
const deleteTask = useDeleteTask()

// --- CLIENT STATE (Pinia) ---
const ui = useBoardUiStore()
const { search, statusFilter, editingTaskId, isModalOpen } = storeToRefs(ui)

// --- DERIVED STATE (computed == useMemo) ---
// Filter by search + status, then group into columns by status.
const filtered = computed(() =>
  (tasks.value ?? []).filter((t) => {
    const matchesSearch =
      !search.value || t.title.toLowerCase().includes(search.value.toLowerCase())
    const matchesStatus = statusFilter.value === 'all' || t.status === statusFilter.value
    return matchesSearch && matchesStatus
  }),
)

const columns = computed(() =>
  STATUSES.map((s) => ({
    ...s,
    tasks: filtered.value.filter((t) => t.status === s.value).sort((a, b) => a.order - b.order),
  })),
)

// The task currently being edited (for the modal).
const editingTask = computed(
  () => (tasks.value ?? []).find((t) => t.id === editingTaskId.value) ?? null,
)

// --- EVENT HANDLERS: translate UI events into mutations ---
function handleMove(taskId: string, toStatus: TaskStatus) {
  // optimistic — UI already moved; this persists it.
  updateTask.mutate({ id: taskId, patch: { status: toStatus } })
}

function handleDelete(id: string) {
  deleteTask.mutate(id)
}

function handleSubmit(input: NewTaskInput) {
  if (editingTask.value) {
    updateTask.mutate({ id: editingTask.value.id, patch: input })
  } else {
    createTask.mutate(input)
  }
  ui.closeModal()
}
</script>

<template>
  <div class="boardPage">
    <!-- Toolbar: client-state controls -->
    <div class="toolbar">
      <input v-model="search" class="toolbarSearch" type="search" placeholder="Search tasks…" />
      <select v-model="statusFilter" class="toolbarFilter">
        <option value="all">All statuses</option>
        <option v-for="s in STATUSES" :key="s.value" :value="s.value">{{ s.label }}</option>
      </select>
      <BaseButton variant="primary" @click="ui.openCreate()">+ New task</BaseButton>
    </div>

    <!-- Loading / error / data states from Query -->
    <p v-if="isLoading" class="stateMsg">Loading board…</p>
    <p v-else-if="isError" class="stateMsg stateMsgError">
      Couldn't load tasks. Check the mock worker is running.
    </p>

    <!-- The board -->
    <div v-else class="board">
      <BoardColumn
        v-for="col in columns"
        :key="col.value"
        :status="col.value"
        :label="col.label"
        :tasks="col.tasks"
        @move="handleMove"
        @edit="ui.openEdit($event)"
        @delete="handleDelete"
      />
    </div>

    <!-- Modal, driven entirely by Pinia UI state -->
    <TaskFormModal
      v-if="isModalOpen"
      :task="editingTask"
      @submit="handleSubmit"
      @close="ui.closeModal()"
    />
  </div>
</template>
