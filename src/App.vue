<script setup lang="ts">
import { RouterView } from 'vue-router'
import BaseButton from '@/components/BaseButton.vue'
import { useBoardUiStore } from '@/stores/boardUi'
const ui = useBoardUiStore()
</script>

<template>
  <div :class="['app', ui.theme === 'dark' ? 'themeDark' : 'themeLight']">
    <header class="appBar">
      <h1 class="appBrand">Kanban<span>·prototype</span></h1>
      <BaseButton variant="ghost" @click="ui.toggleTheme()">Toggle theme</BaseButton>
    </header>
    <main><RouterView /></main>
  </div>
</template>
