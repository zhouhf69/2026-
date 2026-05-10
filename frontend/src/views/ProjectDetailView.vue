<template>
  <MainLayout>
    <div class="space-y-4">
      <h2 class="text-lg font-semibold">研究项目详情</h2>
      <div class="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
        <p class="text-xl font-medium">{{ item?.project_name }}</p>
        <p class="mt-2 text-sm text-slate-400">项目编号：{{ item?.project_code }}</p>
        <div class="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <p class="text-xs text-slate-400">研究类型</p>
            <p>{{ item?.research_type }}</p>
          </div>
          <div>
            <p class="text-xs text-slate-400">项目状态</p>
            <p>{{ item?.project_status }}</p>
          </div>
          <div>
            <p class="text-xs text-slate-400">目标样本量</p>
            <p>{{ item?.sample_target }}</p>
          </div>
          <div>
            <p class="text-xs text-slate-400">当前入组</p>
            <p>{{ item?.current_enrollment }}</p>
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import MainLayout from "@/components/layout/MainLayout.vue";
import { mockProjects } from "@/mock/data";

const route = useRoute();
const item = computed(() => mockProjects.find((it) => it.id === route.params.id));
</script>
