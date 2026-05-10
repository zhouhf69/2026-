<template>
  <MainLayout>
    <div class="space-y-6">
      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="当前项目" :value="metrics.current_projects + ' 个'" />
        <KpiCard label="院内制剂" :value="metrics.hospital_preparations + ' 个'" />
        <KpiCard label="入组病例" :value="metrics.enrolled_cases + ' 例'" />
        <KpiCard label="创面图片" :value="metrics.wound_images + ' 张'" />
        <KpiCard label="随访完成率" :value="metrics.followup_completion_rate + '%'" />
        <KpiCard label="AI分析任务" :value="metrics.ai_analysis_tasks + ' 次'" />
        <KpiCard label="不良反应" :value="metrics.adverse_events + ' 例'" />
        <KpiCard label="生成报告" :value="metrics.generated_reports + ' 份'" />
      </div>

      <div class="grid gap-4 xl:grid-cols-2">
        <div class="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
          <h3 class="mb-3 text-sm font-medium text-slate-300">病例入组趋势</h3>
          <VChart class="h-72" :option="lineOption" autoresize />
        </div>
        <div class="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
          <h3 class="mb-3 text-sm font-medium text-slate-300">制剂使用分布</h3>
          <VChart class="h-72" :option="pieOption" autoresize />
        </div>
      </div>
      <p class="text-xs text-slate-500">
        AI辅助建议，仅供临床研究和医生审核参考，不能替代医生判断。
      </p>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { onMounted, reactive } from "vue";
import { BarChart, LineChart, PieChart } from "echarts/charts";
import { GridComponent, LegendComponent, TooltipComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import { use } from "echarts/core";
import VChart from "vue-echarts";
import MainLayout from "@/components/layout/MainLayout.vue";
import KpiCard from "@/components/common/KpiCard.vue";
import { fetchDashboard } from "@/api";
import { mockMetrics } from "@/mock/data";

use([CanvasRenderer, LineChart, PieChart, BarChart, TooltipComponent, GridComponent, LegendComponent]);

const metrics = reactive({ ...mockMetrics });

const lineOption = {
  tooltip: { trigger: "axis" },
  xAxis: { type: "category", data: ["1月", "2月", "3月", "4月", "5月", "6月"] },
  yAxis: { type: "value" },
  series: [{ type: "line", smooth: true, data: [35, 52, 88, 124, 186, 286], areaStyle: {} }],
};

const pieOption = {
  tooltip: { trigger: "item" },
  legend: { textStyle: { color: "#CBD5E1" } },
  series: [
    {
      type: "pie",
      radius: ["40%", "70%"],
      data: [
        { value: 52, name: "复方黄柏液外用制剂" },
        { value: 44, name: "生肌玉红膏" },
        { value: 31, name: "肛周熏洗方" },
        { value: 25, name: "造口护肤膏" },
      ],
    },
  ],
};

onMounted(async () => {
  try {
    const data = await fetchDashboard();
    Object.assign(metrics, data);
  } catch {
    Object.assign(metrics, mockMetrics);
  }
});
</script>
