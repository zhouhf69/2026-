<template>
  <MainLayout>
    <div class="space-y-4">
      <h2 class="text-lg font-semibold">制剂详情</h2>
      <div class="grid gap-4 rounded-xl border border-slate-800 bg-slate-900/60 p-6 md:grid-cols-2">
        <div>
          <p class="text-xs text-slate-400">制剂名称</p>
          <p class="mt-1">{{ item?.name }}</p>
        </div>
        <div>
          <p class="text-xs text-slate-400">制剂ID</p>
          <p class="mt-1">{{ item?.prep_id }}</p>
        </div>
        <div>
          <p class="text-xs text-slate-400">类型</p>
          <p class="mt-1">{{ item?.prep_type }}</p>
        </div>
        <div>
          <p class="text-xs text-slate-400">剂型</p>
          <p class="mt-1">{{ item?.dosage_form }}</p>
        </div>
        <div class="md:col-span-2">
          <p class="text-xs text-slate-400">临床适应证</p>
          <p class="mt-1">{{ item?.indications || "慢性创面、肛周感染、术后切口修复" }}</p>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import MainLayout from "@/components/layout/MainLayout.vue";
import { mockPreparations } from "@/mock/data";

const route = useRoute();
const item = computed(() => mockPreparations.find((it) => it.id === route.params.id));
</script>
