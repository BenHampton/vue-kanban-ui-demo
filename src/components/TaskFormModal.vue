<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { STATUSES } from '@/types/task'
import type { Task, NewTaskInput, TaskStatus } from '@/types/task'

const props = defineProps<{ task: Task | null }>() // null = create mode

const emit = defineEmits<{
  submit: [input: NewTaskInput]
  close: []
}>()

// Local form state. ref() == useState.
const title = ref('')
const description = ref('')
const status = ref<TaskStatus>('todo')

// Prefill when editing. watchEffect == useEffect that auto-tracks deps.
watchEffect(() => {
  title.value = props.task?.title ?? ''
  description.value = props.task?.description ?? ''
  status.value = props.task?.status ?? 'todo'
})

function handleSubmit() {
  if (!title.value.trim()) {
    return
  }

  emit('submit', {
    title: title.value.trim(),
    description: description.value.trim(),
    status: status.value,
  })
}
</script>

<template>
  <div class="modal__backdrop" @click.self="emit('close')">
    <div class="modal">
      <h3 class="modal__title">{{ task ? 'Edit task' : 'New task' }}</h3>

      <label class="field">
        <span>Title</span>
        <!-- v-model == value + onChange in one. -->
        <input v-model="title" type="text" placeholder="What needs doing?" />
      </label>

      <label class="field">
        <span>Description</span>
        <textarea v-model="description" rows="3" placeholder="Details…"></textarea>
      </label>

      <label class="field">
        <span>Status</span>
        <select v-model="status">
          <option v-for="s in STATUSES" :key="s.value" :value="s.value">{{ s.label }}</option>
        </select>
      </label>

      <div class="modal__actions">
        <button class="btn btn--ghost" @click="emit('close')">Cancel</button>
        <button class="btn btn--primary" @click="handleSubmit">
          {{ task ? 'Save' : 'Create' }}
        </button>
      </div>
    </div>
  </div>
</template>
