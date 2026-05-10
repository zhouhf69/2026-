<template>
  <MainLayout>
    <div class="max-w-4xl space-y-4">
      <h2 class="text-lg font-semibold">随访记录</h2>
      <form class="grid gap-4 rounded-xl border border-slate-800 bg-slate-900/60 p-6 md:grid-cols-2">
        <label class="text-sm">
          疼痛评分
          <input type="number" min="0" max="10" class="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2" />
        </label>
        <label class="text-sm">
          瘙痒评分
          <input type="number" min="0" max="10" class="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2" />
        </label>
        <label class="text-sm">
          渗液情况
          <select class="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2">
            <option>无</option>
            <option>少量</option>
            <option>中量</option>
            <option>大量</option>
          </select>
        </label>
        <label class="text-sm">
          使用依从性
          <select class="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2">
            <option>高</option>
            <option>中</option>
            <option>低</option>
          </select>
        </label>
        <label class="text-sm md:col-span-2">
          不良反应
          <textarea class="mt-1 h-24 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2" />
        </label>
        <button type="button" class="rounded-lg bg-medical-cyan px-4 py-2 text-sm font-semibold text-slate-900">保存（MVP示意）</button>
      </form>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import MainLayout from "@/components/layout/MainLayout.vue";
</script>
