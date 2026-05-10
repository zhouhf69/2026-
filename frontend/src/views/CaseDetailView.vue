<template>
  <MainLayout>
    <div class="space-y-4">
      <h2 class="text-lg font-semibold">病例详情</h2>
      <div class="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
        <div class="grid gap-4 md:grid-cols-2">
          <div>
            <p class="text-xs text-slate-400">病例编号</p>
            <p>{{ item?.case_code }}</p>
          </div>
          <div>
            <p class="text-xs text-slate-400">脱敏ID</p>
            <p>{{ item?.deidentified_id }}</p>
          </div>
          <div>
            <p class="text-xs text-slate-400">主要诊断</p>
            <p>{{ item?.primary_diagnosis }}</p>
          </div>
          <div>
            <p class="text-xs text-slate-400">随访状态</p>
            <p>{{ item?.followup_status }}</p>
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
import { mockCases } from "@/mock/data";

const route = useRoute();
const item = computed(() => mockCases.find((it) => it.id === route.params.id));
</script>
