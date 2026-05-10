<template>
  <MainLayout>
    <div class="space-y-4">
      <h2 class="text-lg font-semibold">创面 / 皮损图像管理</h2>
      <div class="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
        <p class="text-sm text-slate-300">上传创面照片（MVP演示）</p>
        <div class="mt-3 flex gap-3">
          <input type="file" class="text-sm" />
          <button class="rounded-lg bg-medical-cyan px-3 py-2 text-sm font-medium text-slate-900">上传并触发AI占位分析</button>
        </div>
      </div>
      <div class="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60">
        <table class="min-w-full text-sm">
          <thead class="bg-slate-800/60 text-slate-300">
            <tr>
              <th class="px-4 py-3 text-left">图片ID</th>
              <th class="px-4 py-3 text-left">拍照部位</th>
              <th class="px-4 py-3 text-left">AI质量评分</th>
              <th class="px-4 py-3 text-left">审核状态</th>
              <th class="px-4 py-3 text-left">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in rows" :key="row.id" class="border-t border-slate-800">
              <td class="px-4 py-3">{{ row.id }}</td>
              <td class="px-4 py-3">{{ row.site }}</td>
              <td class="px-4 py-3">{{ row.quality }}</td>
              <td class="px-4 py-3">{{ row.status }}</td>
              <td class="px-4 py-3">
                <RouterLink :to="`/wounds/analysis/${row.analysisId}`" class="text-medical-cyan hover:underline">查看分析</RouterLink>
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

const rows = [
  { id: "IMG-001", site: "肛周", quality: 0.92, status: "待医生审核", analysisId: "A-001" },
  { id: "IMG-002", site: "糖足跖面", quality: 0.88, status: "已审核", analysisId: "A-002" },
];
</script>
