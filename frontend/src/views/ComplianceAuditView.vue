<template>
  <MainLayout>
    <div class="space-y-4">
      <h2 class="text-lg font-semibold">合规与审计中心</h2>
      <div class="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60">
        <table class="min-w-full text-sm">
          <thead class="bg-slate-800/60 text-slate-300">
            <tr>
              <th class="px-4 py-3 text-left">日志类型</th>
              <th class="px-4 py-3 text-left">动作</th>
              <th class="px-4 py-3 text-left">操作者</th>
              <th class="px-4 py-3 text-left">时间</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="log in logs" :key="log.id" class="border-t border-slate-800">
              <td class="px-4 py-3">{{ log.log_type }}</td>
              <td class="px-4 py-3">{{ log.action }}</td>
              <td class="px-4 py-3">{{ log.actor }}</td>
              <td class="px-4 py-3">{{ log.created_at }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { apiClient } from "@/api/client";
import MainLayout from "@/components/layout/MainLayout.vue";

const logs = ref<
  Array<{ id: string | number; log_type: string; action: string; actor: string; created_at: string }>
>([
  { id: 1, log_type: "用户操作日志", action: "登录", actor: "admin", created_at: "2026-05-10 08:00" },
  { id: 2, log_type: "AI建议日志", action: "文本AI生成", actor: "pi_demo", created_at: "2026-05-10 08:05" },
]);

onMounted(async () => {
  try {
    const { data } = await apiClient.get("/audit/logs");
    logs.value = data.map((item: Record<string, string>) => ({
      id: item.id,
      log_type: item.log_type,
      action: item.action,
      actor: item.actor || "-",
      created_at: item.created_at?.slice(0, 19).replace("T", " ") || "-",
    }));
  } catch {
    // keep local mock
  }
});
</script>
