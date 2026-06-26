<script setup lang="ts">
import draggable from 'vuedraggable'
import type { Task, TaskStatus } from '@/types/task.ts'
import TaskCard from '@/components/TaskCard.vue'

const props = defineProps<{
  status: TaskStatus
  label: string
  tasks: Task[]
}>()

const emit = defineEmits<{
  move: [taskId: string, toStatus: TaskStatus]
  edit: [id: string]
  delete: [id: string]
}>()

function onAdd(evt: { item: HTMLElement }) {
  const taskId = evt.item.dataset.id as string
  emit('move', taskId, props.status)
}
</script>

<template>
  <section class="column">
    <header class="columnHead">
      <span class="columnLabel">{{ label }}</span>
      <span class="columnCount">{{ tasks.length }}</span>
    </header>

    <draggable
      :list="tasks"
      group="board"
      item-key="id"
      class="columnList"
      ghost-class="cardGhost"
      @add="onAdd"
    >
      <template #item="{ element }">
        <div :data-id="element.id">
          <TaskCard :task="element" @edit="emit('edit', $event)" @delete="emit('delete', $event)" />
        </div>
      </template>
    </draggable>
  </section>
</template>

<style scoped>
.column {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: var(--sp-3);
}
.columnHead {
  display: flex;
  justify-content: space-between;
  padding: var(--sp-2) var(--sp-2) var(--sp-3);
}
.columnLabel {
  font-weight: 600;
}
.columnCount {
  color: var(--text-dim);
}
.columnList {
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
  min-height: 40px;
}
.cardGhost {
  opacity: 0.4;
}
</style>
