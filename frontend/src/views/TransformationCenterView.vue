<template>
  <MainLayout>
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold">循证转化中心</h2>
        <span class="text-xs text-slate-400">转化阶段：临床经验积累 → 病例系列 → RWS → 多中心 → 专家共识 → 产品转化</span>
      </div>

      <form class="grid gap-3 rounded-xl border border-slate-700 bg-slate-900/60 p-4 md:grid-cols-5" @submit.prevent="submit">
        <input v-model="form.transformation_name" class="rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm" placeholder="转化项目名称" />
        <select v-model="form.evidence_level" class="rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm">
          <option value="">证据等级</option>
          <option>IV级</option>
          <option>III级</option>
          <option>II级</option>
        </select>
        <select v-model="form.market_potential" class="rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm">
          <option value="">市场潜力</option>
          <option>高</option>
          <option>中高</option>
          <option>中</option>
        </select>
        <select v-model="form.phase" class="rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm">
          <option>临床经验积累</option>
          <option>病例系列</option>
          <option>真实世界研究</option>
          <option>多中心研究</option>
          <option>专家共识</option>
          <option>产品转化</option>
        </select>
        <button class="rounded bg-medical-cyan px-3 py-2 text-sm font-semibold text-slate-900">新建立项</button>
      </form>

      <div class="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60">
        <table class="min-w-full text-sm">
          <thead class="bg-slate-800/60 text-slate-300">
            <tr>
              <th class="px-4 py-3 text-left">项目名称</th>
              <th class="px-4 py-3 text-left">证据等级</th>
              <th class="px-4 py-3 text-left">市场潜力</th>
              <th class="px-4 py-3 text-left">阶段</th>
              <th class="px-4 py-3 text-left">里程碑</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in rows" :key="item.id" class="border-t border-slate-800">
              <td class="px-4 py-3">{{ item.transformation_name }}</td>
              <td class="px-4 py-3">{{ item.evidence_level || "-" }}</td>
              <td class="px-4 py-3">{{ item.market_potential || "-" }}</td>
              <td class="px-4 py-3">{{ item.phase }}</td>
              <td class="px-4 py-3">{{ item.milestones || "待补充" }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { createTransformationProject, fetchTransformationProjects } from "@/api";
import MainLayout from "@/components/layout/MainLayout.vue";
import { mockTransformationProjects } from "@/mock/data";
import type { TransformationItem } from "@/types";

const rows = ref<TransformationItem[]>([]);
const form = reactive({
  transformation_name: "",
  evidence_level: "",
  market_potential: "",
  phase: "临床经验积累",
  milestones: "",
});

onMounted(async () => {
  try {
    rows.value = await fetchTransformationProjects();
  } catch {
    rows.value = mockTransformationProjects;
  }
});

async function submit() {
  if (!form.transformation_name) return;
  try {
    const created = await createTransformationProject(form);
    rows.value = [created, ...rows.value];
  } catch {
    rows.value = [
      {
        id: `mock-${Date.now()}`,
        transformation_name: form.transformation_name,
        evidence_level: form.evidence_level,
        market_potential: form.market_potential,
        phase: form.phase,
        milestones: form.milestones,
      },
      ...rows.value,
    ];
  }
  form.transformation_name = "";
  form.evidence_level = "";
  form.market_potential = "";
  form.phase = "临床经验积累";
  form.milestones = "";
}
</script>
