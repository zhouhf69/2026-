<template>
  <MainLayout>
    <div class="space-y-4">
      <h2 class="text-lg font-semibold">SOP中心</h2>
      <div class="grid gap-4 md:grid-cols-2">
        <div v-for="sop in sops" :key="sop.id" class="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <p class="font-medium">{{ sop.name }}</p>
          <p class="mt-1 text-xs text-slate-400">类型：{{ sop.type }} · 版本：{{ sop.version }}</p>
          <RouterLink :to="`/sops/edit/${sop.id}`" class="mt-3 inline-block text-sm text-medical-cyan hover:underline">编辑SOP</RouterLink>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import MainLayout from "@/components/layout/MainLayout.vue";

const sops = [
  { id: "SOP-001", name: "创面图像采集SOP", type: "图像采集SOP", version: "v1.0" },
  { id: "SOP-002", name: "病例入组SOP", type: "病例入组SOP", version: "v1.1" },
];
</script>
