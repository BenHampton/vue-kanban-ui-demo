import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useBoardUiStore } from '@/stores/boardUi'

describe('boardUi store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('starts closed with the default dark theme', () => {
    const ui = useBoardUiStore()
    expect(ui.theme).toBe('dark')
    expect(ui.isModalOpen).toBe(false)
  })

  it('openCreate opens the modal in create mode', () => {
    const ui = useBoardUiStore()
    ui.openCreate()
    expect(ui.isCreating).toBe(true)
    expect(ui.editingTaskId).toBeNull()
    expect(ui.isModalOpen).toBe(true)
  })

  it('openEdit opens the modal for a specific task', () => {
    const ui = useBoardUiStore()
    ui.openEdit('t1')
    expect(ui.editingTaskId).toBe('t1')
    expect(ui.isCreating).toBe(false)
    expect(ui.isModalOpen).toBe(true)
  })

  it('closeModal resets create and edit state', () => {
    const ui = useBoardUiStore()
    ui.openEdit('t1')
    ui.closeModal()
    expect(ui.editingTaskId).toBeNull()
    expect(ui.isCreating).toBe(false)
    expect(ui.isModalOpen).toBe(false)
  })

  it('toggleTheme flips between dark and light', () => {
    const ui = useBoardUiStore()
    expect(ui.theme).toBe('dark')
    ui.toggleTheme()
    expect(ui.theme).toBe('light')
    ui.toggleTheme()
    expect(ui.theme).toBe('dark')
  })
})
