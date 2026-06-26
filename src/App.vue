<script setup lang="ts">
import BoardView from '@/views/BoardView.vue'
import { useBoardUiStore } from '@/stores/boardUi'
const ui = useBoardUiStore()
</script>

<template>
  <div :class="['app', `theme--${ui.theme}`]">
    <header class="app__bar">
      <h1 class="app__brand">Kanban<span>·prototype</span></h1>
      <button class="btn btn--ghost" @click="ui.toggleTheme()">Toggle theme</button>
    </header>
    <main><BoardView /></main>
  </div>
</template>
