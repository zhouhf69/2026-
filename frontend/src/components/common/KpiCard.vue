<template>
  <div class="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
    <p class="text-xs text-slate-400">{{ label }}</p>
    <p class="mt-2 text-2xl font-semibold text-medical-cyan">{{ value }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string;
  value: string | number;
}>();
</script>
