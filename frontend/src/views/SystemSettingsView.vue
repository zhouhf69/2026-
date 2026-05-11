<template>
  <MainLayout>
    <div class="space-y-4">
      <h2 class="text-lg font-semibold">系统设置</h2>
      <div class="grid gap-4 xl:grid-cols-3">
        <div class="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <p class="text-sm font-medium text-slate-300">AI模型配置</p>
          <div class="mt-3 space-y-2 text-sm">
            <label class="flex items-center justify-between rounded border border-slate-700 p-2" v-for="provider in config.ai_providers" :key="provider">
              <span>{{ provider }}</span>
              <input type="checkbox" checked />
            </label>
          </div>
        </div>
        <div class="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <p class="text-sm font-medium text-slate-300">评分量表</p>
          <ul class="mt-3 space-y-2 text-sm text-slate-200">
            <li v-for="scale in config.score_scales" :key="scale" class="rounded border border-slate-700 px-3 py-2">{{ scale }}</li>
          </ul>
        </div>
        <div class="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <p class="text-sm font-medium text-slate-300">消息提醒配置</p>
          <div class="mt-3 space-y-2 text-sm">
            <label class="flex items-center justify-between rounded border border-slate-700 p-2" v-for="channel in config.message_channels" :key="channel">
              <span>{{ channel }}</span>
              <input type="checkbox" :checked="channel === '站内消息'" />
            </label>
          </div>
          <button class="mt-3 rounded bg-medical-cyan px-3 py-2 text-xs font-semibold text-slate-900">保存配置（MVP）</button>
        </div>
      </div>

      <div class="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <p class="text-sm font-medium text-slate-300">科室管理</p>
        <div class="mt-3 flex flex-wrap gap-2">
          <span v-for="dept in config.departments" :key="dept" class="rounded-full border border-slate-700 px-3 py-1 text-xs">{{ dept }}</span>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { onMounted, reactive } from "vue";
import { fetchSystemConfig } from "@/api";
import MainLayout from "@/components/layout/MainLayout.vue";
import { mockSystemConfig } from "@/mock/data";

const config = reactive({
  departments: [] as string[],
  score_scales: [] as string[],
  ai_providers: [] as string[],
  message_channels: [] as string[],
});

onMounted(async () => {
  try {
    Object.assign(config, await fetchSystemConfig());
  } catch {
    Object.assign(config, mockSystemConfig);
  }
});
</script>
