<template>
  <MainLayout>
    <div class="space-y-4">
      <h2 class="text-lg font-semibold">AI科研助手</h2>
      <div class="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
        <div class="grid gap-4 md:grid-cols-3">
          <label class="text-sm">
            Provider
            <select v-model="provider" class="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2">
              <option>openai</option>
              <option>gemini</option>
              <option>deepseek</option>
              <option>kimi</option>
              <option>qwen</option>
              <option>local</option>
            </select>
          </label>
          <label class="text-sm">
            任务类型
            <select v-model="taskType" class="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2">
              <option value="sop">SOP生成</option>
              <option value="protocol">研究方案</option>
              <option value="crf">CRF生成</option>
              <option value="paper">论文初稿</option>
              <option value="report">汇报材料</option>
              <option value="evidence_package">证据包</option>
            </select>
          </label>
          <label class="text-sm">
            研究问题
            <input v-model="question" class="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2" />
          </label>
        </div>
        <button class="mt-4 rounded-lg bg-medical-cyan px-4 py-2 text-sm font-semibold text-slate-900" @click="generateMock">
          生成（MVP占位）
        </button>
      </div>
      <div class="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
        <p class="text-sm whitespace-pre-wrap">{{ output }}</p>
      </div>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { ref } from "vue";
import MainLayout from "@/components/layout/MainLayout.vue";

const provider = ref("openai");
const taskType = ref("protocol");
const question = ref("生肌玉红膏用于慢性创面的真实世界疗效观察");
const output = ref("尚未生成。");

function generateMock() {
  output.value = `任务类型：${taskType.value}\nProvider：${provider.value}\n研究问题：${question.value}\n\n` +
    "输出摘要：建议采用前瞻性单臂真实世界研究，设置D1/D3/D7/D14/D30节点，主要终点为愈合率与疼痛评分变化。\n\n" +
    "AI辅助建议，仅供临床研究和医生审核参考，不能替代医生判断。";
}
</script>
