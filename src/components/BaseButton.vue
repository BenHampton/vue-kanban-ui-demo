<script setup lang="ts">
defineProps<{ variant?: 'primary' | 'ghost' }>()
</script>

<template>
  <button class="btn" :class="variant === 'primary' ? 'btnPrimary' : 'btnGhost'">
    <slot />
  </button>
</template>

<style scoped>
.btn {
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: var(--sp-2) var(--sp-4);
  font: inherit;
  cursor: pointer;
}
.btnPrimary {
  background: var(--accent);
  color: var(--accent-ink);
  border-color: transparent;
}
.btnGhost {
  background: transparent;
  color: var(--text);
}
</style>
