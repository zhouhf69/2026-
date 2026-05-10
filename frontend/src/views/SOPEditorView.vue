<template>
  <MainLayout>
    <div class="max-w-4xl space-y-4">
      <h2 class="text-lg font-semibold">SOP编辑</h2>
      <form class="space-y-4 rounded-xl border border-slate-800 bg-slate-900/60 p-6">
        <label class="block text-sm">
          SOP名称
          <input class="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2" value="创面图像采集SOP" />
        </label>
        <label class="block text-sm">
          操作步骤
          <textarea class="mt-1 h-28 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2">同角度、同距离、同光照拍摄，标尺入镜。</textarea>
        </label>
        <label class="block text-sm">
          AI建议
          <textarea class="mt-1 h-24 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2">建议使用统一拍照模板，提高面积估算一致性。</textarea>
        </label>
        <button type="button" class="rounded-lg bg-medical-cyan px-4 py-2 text-sm font-semibold text-slate-900">保存版本（MVP示意）</button>
      </form>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import MainLayout from "@/components/layout/MainLayout.vue";
</script>
