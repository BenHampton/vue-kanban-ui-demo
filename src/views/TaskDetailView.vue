<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useTasksQuery } from '@/composables/useTasks'
import { STATUSES } from '@/types/task'

const route = useRoute()
const taskId = computed(() => String(route.params.id))

// Reuse the board's list query and derive the single task from cache —
// same pattern as BoardView's `editingTask`. No extra endpoint needed.
const { data: tasks, isLoading, isError } = useTasksQuery()
const task = computed(() => (tasks.value ?? []).find((t) => t.id === taskId.value) ?? null)

const statusLabel = computed(
  () => STATUSES.find((s) => s.value === task.value?.status)?.label ?? task.value?.status,
)
const createdAt = computed(() =>
  task.value ? new Date(task.value.createdAt).toLocaleString() : '',
)
</script>

<template>
  <div class="detailPage">
    <RouterLink class="backLink" :to="{ name: 'board' }">← Back to board</RouterLink>

    <p v-if="isLoading" class="stateMsg">Loading task…</p>
    <p v-else-if="isError" class="stateMsg stateMsgError">
      Couldn't load the task. Check the mock worker is running.
    </p>
    <p v-else-if="!task" class="stateMsg">No task found for id “{{ taskId }}”.</p>

    <article v-else class="detailCard">
      <header class="detailHead">
        <h2>{{ task.title }}</h2>
        <span class="badge">{{ statusLabel }}</span>
      </header>
      <p v-if="task.description" class="detailDesc">{{ task.description }}</p>
      <p v-else class="detailDesc detailDescEmpty">No description.</p>
      <footer class="detailMeta">Created {{ createdAt }}</footer>
    </article>
  </div>
</template>

<style scoped>
.detailPage {
  max-width: 640px;
  margin: 0 auto;
  padding: var(--sp-6) var(--sp-4);
  display: flex;
  flex-direction: column;
  gap: var(--sp-4);
}
.backLink {
  color: var(--text-dim);
  text-decoration: none;
  font-size: 14px;
}
.backLink:hover {
  color: var(--text);
}
.detailCard {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: var(--sp-6);
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
}
.detailHead {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--sp-3);
}
.detailHead h2 {
  margin: 0;
}
.badge {
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: 999px;
  padding: var(--sp-1) var(--sp-3);
  font-size: 13px;
  color: var(--text-dim);
  white-space: nowrap;
}
.detailDesc {
  margin: 0;
  line-height: 1.6;
}
.detailDescEmpty {
  color: var(--text-dim);
}
.detailMeta {
  margin: 0;
  color: var(--text-dim);
  font-size: 13px;
}
.stateMsg {
  color: var(--text-dim);
}
.stateMsgError {
  color: var(--danger);
}
</style>
