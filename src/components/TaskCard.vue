<script setup lang="ts">
import type { Task } from '@/types/task'

defineProps<{ task: Task}>()

const emit = defineEmits<{
  edit: [id: string]
  delete: [id: string]
}>()
</script>

<template>
  <article class="card">
    <header class="card__head">
      <h4>{{ task.title }}</h4>
      <div class="card__actions">
        <button class="icon-btn" title="Edit" @click="emit('edit', task.id)">Edit</button>
        <button class="icon-btn" title="Delete" @click="emit('delete', task.id)">Delete</button>
      </div>
    </header>
    <p v-if="task.description">{{ task.description }}</p>
  </article>
</template>

<style scoped>

</style>
