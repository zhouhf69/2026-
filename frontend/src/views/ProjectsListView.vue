<template>
  <MainLayout>
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold">真实世界研究项目管理</h2>
        <RouterLink to="/projects/new" class="rounded-lg bg-medical-cyan px-3 py-2 text-sm font-medium text-slate-900">
          新建项目
        </RouterLink>
      </div>
      <div class="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60">
        <table class="min-w-full text-sm">
          <thead class="bg-slate-800/60 text-slate-300">
            <tr>
              <th class="px-4 py-3 text-left">项目名称</th>
              <th class="px-4 py-3 text-left">项目编号</th>
              <th class="px-4 py-3 text-left">研究类型</th>
              <th class="px-4 py-3 text-left">状态</th>
              <th class="px-4 py-3 text-left">入组进度</th>
              <th class="px-4 py-3 text-left">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in items" :key="item.id" class="border-t border-slate-800">
              <td class="px-4 py-3">{{ item.project_name }}</td>
              <td class="px-4 py-3">{{ item.project_code }}</td>
              <td class="px-4 py-3">{{ item.research_type }}</td>
              <td class="px-4 py-3">{{ item.project_status }}</td>
              <td class="px-4 py-3">{{ item.current_enrollment }}/{{ item.sample_target }}</td>
              <td class="px-4 py-3">
                <RouterLink :to="`/projects/${item.id}`" class="text-medical-cyan hover:underline">查看</RouterLink>
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
import { fetchProjects } from "@/api";
import { mockProjects } from "@/mock/data";
import type { ProjectItem } from "@/types";

const items = ref<ProjectItem[]>([]);

onMounted(async () => {
  try {
    items.value = await fetchProjects();
  } catch {
    items.value = mockProjects;
  }
});
</script>
