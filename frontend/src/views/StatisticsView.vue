<template>
  <MainLayout>
    <div class="space-y-4">
      <h2 class="text-lg font-semibold">统计分析与图表中心</h2>
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
import { BarChart, FunnelChart } from "echarts/charts";
import { GridComponent, TooltipComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import { use } from "echarts/core";
import VChart from "vue-echarts";
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
</script>
