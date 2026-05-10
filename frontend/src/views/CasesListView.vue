<template>
  <MainLayout>
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold">患者与病例管理（脱敏）</h2>
        <RouterLink to="/cases/new" class="rounded-lg bg-medical-cyan px-3 py-2 text-sm font-medium text-slate-900">
          新增病例
        </RouterLink>
      </div>
      <div class="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60">
        <table class="min-w-full text-sm">
          <thead class="bg-slate-800/60 text-slate-300">
            <tr>
              <th class="px-4 py-3 text-left">病例编号</th>
              <th class="px-4 py-3 text-left">脱敏ID</th>
              <th class="px-4 py-3 text-left">年龄</th>
              <th class="px-4 py-3 text-left">性别</th>
              <th class="px-4 py-3 text-left">主要诊断</th>
              <th class="px-4 py-3 text-left">随访状态</th>
              <th class="px-4 py-3 text-left">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in items" :key="item.id" class="border-t border-slate-800">
              <td class="px-4 py-3">{{ item.case_code }}</td>
              <td class="px-4 py-3">{{ item.deidentified_id }}</td>
              <td class="px-4 py-3">{{ item.age }}</td>
              <td class="px-4 py-3">{{ item.gender }}</td>
              <td class="px-4 py-3">{{ item.primary_diagnosis }}</td>
              <td class="px-4 py-3">{{ item.followup_status }}</td>
              <td class="px-4 py-3">
                <RouterLink :to="`/cases/${item.id}`" class="text-medical-cyan hover:underline">查看</RouterLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p class="text-xs text-slate-500">仅保存脱敏ID，不保存姓名/身份证/手机号等敏感标识。</p>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import MainLayout from "@/components/layout/MainLayout.vue";
import { fetchCases } from "@/api";
import { mockCases } from "@/mock/data";
import type { CaseItem } from "@/types";

const items = ref<CaseItem[]>([]);

onMounted(async () => {
  try {
    items.value = await fetchCases();
  } catch {
    items.value = mockCases;
  }
});
</script>
