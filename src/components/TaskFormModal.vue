<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import BaseButton from '@/components/BaseButton.vue'
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
  <div class="modalBackdrop" @click.self="emit('close')">
    <div class="modal">
      <h3 class="modalTitle">{{ task ? 'Edit task' : 'New task' }}</h3>

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

      <div class="modalActions">
        <BaseButton variant="ghost" @click="emit('close')">Cancel</BaseButton>
        <BaseButton variant="primary" @click="handleSubmit">
          {{ task ? 'Save' : 'Create' }}
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modalBackdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: grid;
  place-items: center;
  padding: var(--sp-4);
}
.modal {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: var(--sp-6);
  width: min(440px, 100%);
  display: flex;
  flex-direction: column;
  gap: var(--sp-4);
}
.field {
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
}
.field span {
  font-size: 13px;
  color: var(--text-dim);
}
.modalActions {
  display: flex;
  justify-content: flex-end;
  gap: var(--sp-3);
}
</style>
