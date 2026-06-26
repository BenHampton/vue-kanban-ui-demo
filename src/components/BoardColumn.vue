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

function onAdd(evt: any) {
  const taskId = evt.item.dataset.id as string
  emit('move', taskId, props.status)
}
</script>

<template>
  <section class="column">
    <header class="column__head">
      <span class="column__label">{{ label }}</span>
      <span class="column__count">{{ tasks.length }}</span>
    </header>

    <draggable
      :list="tasks"
      group="board"
      item-key="id"
      class="column__list"
      ghost-class="card--ghost"
      @add="onAdd"
    >
      <template #item="{ element }">
        <div :data-id="element.id">
          <TaskCard
            :task="element"
            @edit="emit('edit', $event)"
            @delete="emit('delete', $event)"
          />
        </div>
      </template>
    </draggable>
  </section>
</template>

<style scoped>

</style>
