<script setup lang="ts">
import type { Task } from '@/types/task'

defineProps<{ task: Task }>()

const emit = defineEmits<{
  edit: [id: string]
  delete: [id: string]
}>()
</script>

<template>
  <article class="card">
    <header class="cardHead">
      <h4>{{ task.title }}</h4>
      <div class="cardActions">
        <button class="iconBtn" title="Edit" @click="emit('edit', task.id)">Edit</button>
        <button class="iconBtn" title="Delete" @click="emit('delete', task.id)">Delete</button>
      </div>
    </header>
    <p v-if="task.description">{{ task.description }}</p>
  </article>
</template>

<style scoped>
.card {
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: var(--sp-3);
  cursor: grab;
}
.card:active {
  cursor: grabbing;
}
.cardHead {
  display: flex;
  justify-content: space-between;
  gap: var(--sp-2);
}
.cardTitle {
  margin: 0;
  font-size: 14px;
}
.cardDesc {
  margin: var(--sp-2) 0 0;
  color: var(--text-dim);
  font-size: 13px;
}
.cardActions {
  display: flex;
  gap: var(--sp-1);
  opacity: 0;
  transition: 0.15s;
}
.card:hover .cardActions {
  opacity: 1;
}
.iconBtn {
  background: none;
  border: none;
  color: var(--text-dim);
  cursor: pointer;
  font-size: 14px;
}
.iconBtn:hover {
  color: var(--text);
}
</style>
