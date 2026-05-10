<template>
  <MainLayout>
    <div class="space-y-4">
      <h2 class="text-lg font-semibold">随访任务列表</h2>
      <div class="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <p class="text-sm text-slate-300">随访节点：D1 / D3 / D7 / D14 / D30 / D60 / D90</p>
      </div>
      <div class="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60">
        <table class="min-w-full text-sm">
          <thead class="bg-slate-800/60 text-slate-300">
            <tr>
              <th class="px-4 py-3 text-left">病例</th>
              <th class="px-4 py-3 text-left">节点</th>
              <th class="px-4 py-3 text-left">状态</th>
              <th class="px-4 py-3 text-left">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="task in tasks" :key="task.id" class="border-t border-slate-800">
              <td class="px-4 py-3">{{ task.caseCode }}</td>
              <td class="px-4 py-3">{{ task.node }}</td>
              <td class="px-4 py-3">{{ task.status }}</td>
              <td class="px-4 py-3">
                <RouterLink :to="`/followups/record/${task.id}`" class="text-medical-cyan hover:underline">记录随访</RouterLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import MainLayout from "@/components/layout/MainLayout.vue";

const tasks = [
  { id: "F-001", caseCode: "CASE-001", node: "D14", status: "待完成" },
  { id: "F-002", caseCode: "CASE-002", node: "D30", status: "已完成" },
];
</script>
