<template>
  <MainLayout>
    <div class="max-w-3xl space-y-4">
      <h2 class="text-lg font-semibold">新增 / 编辑制剂</h2>
      <form class="grid gap-4 rounded-xl border border-slate-800 bg-slate-900/60 p-6 md:grid-cols-2">
        <label class="text-sm">
          制剂名称
          <input class="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2" />
        </label>
        <label class="text-sm">
          制剂ID
          <input class="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2" />
        </label>
        <label class="text-sm">
          类型
          <select class="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2">
            <option>经典名方</option>
            <option>经验方</option>
            <option>外用药</option>
          </select>
        </label>
        <label class="text-sm">
          剂型
          <select class="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2">
            <option>膏剂</option>
            <option>洗剂</option>
            <option>散剂</option>
            <option>油剂</option>
          </select>
        </label>
        <label class="text-sm md:col-span-2">
          功效主治
          <textarea class="mt-1 h-28 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2" />
        </label>
        <button type="button" class="rounded-lg bg-medical-cyan px-4 py-2 text-sm font-semibold text-slate-900">保存（MVP示意）</button>
      </form>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import MainLayout from "@/components/layout/MainLayout.vue";
</script>
