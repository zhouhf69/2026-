<template>
  <MainLayout>
    <div class="max-w-4xl space-y-4">
      <h2 class="text-lg font-semibold">新增病例（脱敏录入）</h2>
      <form class="grid gap-4 rounded-xl border border-slate-800 bg-slate-900/60 p-6 md:grid-cols-2">
        <label class="text-sm">
          病例编号
          <input class="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2" placeholder="CASE-001" />
        </label>
        <label class="text-sm">
          脱敏患者ID
          <input class="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2" placeholder="PID-XXXXXX" />
        </label>
        <label class="text-sm">
          年龄
          <input type="number" class="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2" />
        </label>
        <label class="text-sm">
          性别
          <select class="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2">
            <option>男</option>
            <option>女</option>
            <option>其他</option>
          </select>
        </label>
        <label class="text-sm md:col-span-2">
          主要诊断
          <input class="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2" />
        </label>
        <button type="button" class="rounded-lg bg-medical-cyan px-4 py-2 text-sm font-semibold text-slate-900">保存（MVP示意）</button>
      </form>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import MainLayout from "@/components/layout/MainLayout.vue";
</script>
