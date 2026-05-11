<template>
  <MainLayout>
    <div class="space-y-4">
      <h2 class="text-lg font-semibold">统计分析与图表中心</h2>
      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <div class="rounded border border-slate-800 bg-slate-900/60 p-3 text-sm">
          <p class="text-xs text-slate-400">项目数</p>
          <p class="mt-1 text-medical-cyan">{{ summary.project_count }}</p>
        </div>
        <div class="rounded border border-slate-800 bg-slate-900/60 p-3 text-sm">
          <p class="text-xs text-slate-400">病例数</p>
          <p class="mt-1 text-medical-cyan">{{ summary.case_count }}</p>
        </div>
        <div class="rounded border border-slate-800 bg-slate-900/60 p-3 text-sm">
          <p class="text-xs text-slate-400">制剂数</p>
          <p class="mt-1 text-medical-cyan">{{ summary.preparation_count }}</p>
        </div>
        <div class="rounded border border-slate-800 bg-slate-900/60 p-3 text-sm">
          <p class="text-xs text-slate-400">不良事件</p>
          <p class="mt-1 text-medical-cyan">{{ summary.adverse_event_count }}</p>
        </div>
        <div class="rounded border border-slate-800 bg-slate-900/60 p-3 text-sm">
          <p class="text-xs text-slate-400">随访完成率</p>
          <p class="mt-1 text-medical-cyan">{{ summary.followup_completion_rate }}%</p>
        </div>
      </div>
      <div class="grid gap-4 xl:grid-cols-2">
        <div class="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <h3 class="mb-2 text-sm text-slate-300">疗效前后对比</h3>
          <VChart class="h-72" :option="barOption" autoresize />
        </div>
        <div class="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <h3 class="mb-2 text-sm text-slate-300">随访漏斗图（占位）</h3>
          <VChart class="h-72" :option="funnelOption" autoresize />
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { onMounted, reactive } from "vue";
import { BarChart, FunnelChart } from "echarts/charts";
import { GridComponent, TooltipComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import { use } from "echarts/core";
import VChart from "vue-echarts";
import { fetchStatisticsOverview } from "@/api";
import MainLayout from "@/components/layout/MainLayout.vue";

use([CanvasRenderer, BarChart, FunnelChart, TooltipComponent, GridComponent]);

const barOption = {
  xAxis: { type: "category", data: ["基线", "D7", "D14", "D30"] },
  yAxis: { type: "value" },
  series: [{ type: "bar", data: [42, 56, 70, 83] }],
};

const funnelOption = {
  series: [
    {
      type: "funnel",
      data: [
        { value: 286, name: "已入组" },
        { value: 248, name: "完成D14" },
        { value: 211, name: "完成D30" },
        { value: 176, name: "完成D90" },
      ],
    },
  ],
};

const summary = reactive({
  project_count: 12,
  case_count: 286,
  preparation_count: 38,
  adverse_event_count: 6,
  followup_completion_rate: 82,
});

onMounted(async () => {
  try {
    const data = await fetchStatisticsOverview();
    Object.assign(summary, data.summary);
    barOption.series[0].data = data.charts.healing_curve;
    funnelOption.series[0].data = data.charts.followup_funnel.map((item) => ({ value: item.value, name: item.stage }));
  } catch {
    // use local mock defaults
  }
});
</script>
