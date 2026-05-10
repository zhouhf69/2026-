<template>
  <MainLayout>
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold">院内制剂库</h2>
        <RouterLink to="/preparations/new" class="rounded-lg bg-medical-cyan px-3 py-2 text-sm font-medium text-slate-900">
          新增制剂
        </RouterLink>
      </div>
      <div class="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60">
        <table class="min-w-full text-sm">
          <thead class="bg-slate-800/60 text-slate-300">
            <tr>
              <th class="px-4 py-3 text-left">制剂ID</th>
              <th class="px-4 py-3 text-left">制剂名称</th>
              <th class="px-4 py-3 text-left">类型</th>
              <th class="px-4 py-3 text-left">剂型</th>
              <th class="px-4 py-3 text-left">证据等级</th>
              <th class="px-4 py-3 text-left">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in items" :key="item.id" class="border-t border-slate-800">
              <td class="px-4 py-3">{{ item.prep_id }}</td>
              <td class="px-4 py-3">{{ item.name }}</td>
              <td class="px-4 py-3">{{ item.prep_type }}</td>
              <td class="px-4 py-3">{{ item.dosage_form }}</td>
              <td class="px-4 py-3">{{ item.evidence_level || "-" }}</td>
              <td class="px-4 py-3">
                <RouterLink :to="`/preparations/${item.id}`" class="text-medical-cyan hover:underline">查看</RouterLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import MainLayout from "@/components/layout/MainLayout.vue";
import { fetchPreparations } from "@/api";
import { mockPreparations } from "@/mock/data";
import type { PreparationItem } from "@/types";

const items = ref<PreparationItem[]>([]);

onMounted(async () => {
  try {
    items.value = await fetchPreparations();
  } catch {
    items.value = mockPreparations;
  }
});
</script>
