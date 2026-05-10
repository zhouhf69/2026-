<template>
  <MainLayout>
    <div class="max-w-4xl space-y-4">
      <h2 class="text-lg font-semibold">新建研究项目</h2>
      <form class="grid gap-4 rounded-xl border border-slate-800 bg-slate-900/60 p-6 md:grid-cols-2">
        <label class="text-sm">
          项目名称
          <input class="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2" />
        </label>
        <label class="text-sm">
          项目编号
          <input class="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2" />
        </label>
        <label class="text-sm">
          研究类型
          <select class="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2">
            <option>回顾性研究</option>
            <option>前瞻性队列研究</option>
            <option>病例系列研究</option>
            <option>单臂真实世界研究</option>
          </select>
        </label>
        <label class="text-sm">
          样本量目标
          <input type="number" class="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2" />
        </label>
        <label class="text-sm md:col-span-2">
          入组标准
          <textarea class="mt-1 h-24 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2" />
        </label>
        <label class="text-sm md:col-span-2">
          排除标准
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
