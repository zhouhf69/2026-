<template>
  <MainLayout>
    <div class="space-y-4">
      <h2 class="text-lg font-semibold">创面AI分析详情</h2>
      <div class="grid gap-4 rounded-xl border border-slate-800 bg-slate-900/60 p-6 md:grid-cols-2">
        <div v-for="item in metrics" :key="item.label" class="rounded border border-slate-800 p-3">
          <p class="text-xs text-slate-400">{{ item.label }}</p>
          <p class="mt-1 text-medical-cyan">{{ item.value }}</p>
        </div>
      </div>
      <p class="rounded-lg border border-amber-700/40 bg-amber-500/10 p-3 text-xs text-amber-200">
        AI辅助建议，仅供临床研究和医生审核参考，不能替代医生判断。
      </p>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import MainLayout from "@/components/layout/MainLayout.vue";

const metrics = [
  { label: "wound_area", value: "6.8 cm²" },
  { label: "redness_score", value: "2" },
  { label: "exudate_score", value: "2" },
  { label: "granulation_score", value: "3" },
  { label: "necrosis_score", value: "1" },
  { label: "infection_risk_score", value: "2" },
  { label: "healing_percentage", value: "63%" },
  { label: "confidence_score", value: "0.89" },
];
</script>
