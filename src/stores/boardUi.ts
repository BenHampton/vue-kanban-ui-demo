import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { TaskStatus } from '@/types/task.ts'

export const useBoardUiStore = defineStore('boardUi', () => {

  // state
  const theme = ref<'dark' | 'light'>('dark')
  const search = ref('')
  const statusFilter = ref<TaskStatus | 'all'>('all')
  const editingTaskId = ref<string | null>(null)
  const isCreating = ref(false)

  // getters
  const isModalOpen = computed(() => isCreating.value || editingTaskId.value !== null)

  // actions
  function openCreate() {
    isCreating.value = true
    editingTaskId.value = null
  }

  function openEdit(id: string) {
    editingTaskId.value = id;
    isCreating.value = false
  }

  function closeModal() {
    isCreating.value = false;
    editingTaskId.value = null
  }

  function toggleTheme() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }

  return{
    theme,
    search,
    statusFilter,
    editingTaskId,
    isCreating,
    isModalOpen,
    openCreate,
    openEdit,
    closeModal,
    toggleTheme
  }
})
