<template>
  <div class="rounded-xl border border-dashed border-slate-700 bg-slate-900/40 p-8">
    <h2 class="text-lg font-semibold">{{ title }}</h2>
    <p class="mt-2 text-sm text-slate-400">
      {{ description }}
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  description: string;
}>();
</script>
