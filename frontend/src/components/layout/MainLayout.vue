<template>
  <div class="min-h-screen bg-medical-900 text-slate-100">
    <div class="flex">
      <aside class="hidden w-72 border-r border-slate-800 bg-medical-800 p-4 lg:block">
        <h1 class="text-lg font-semibold text-medical-gold">PrepRWS AI</h1>
        <p class="mt-1 text-xs text-slate-400">AI辅助院内制剂真实世界研究与循证转化平台</p>
        <nav class="mt-6 space-y-1">
          <RouterLink
            v-for="item in menus"
            :key="item.path"
            :to="item.path"
            class="block rounded-lg px-3 py-2 text-sm text-slate-200 transition hover:bg-slate-700/60"
            active-class="bg-slate-700 text-medical-cyan"
          >
            {{ item.label }}
          </RouterLink>
        </nav>
      </aside>
      <main class="w-full">
        <header class="border-b border-slate-800 bg-slate-900/80 px-6 py-4 backdrop-blur">
          <div class="flex items-center justify-between gap-4">
            <div>
              <p class="text-base font-semibold">让经验方成为证据资产，让院内制剂走向循证转化。</p>
              <p class="text-xs text-slate-400">面向经典名方、外用药与院内制剂的AI真实世界研究操作系统。</p>
            </div>
            <input
              type="text"
              placeholder="搜索项目 / 制剂 / 病例"
              class="w-72 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none ring-medical-cyan focus:ring-2"
            />
          </div>
        </header>
        <section class="p-6">
          <slot />
        </section>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
const menus = [
  { path: "/dashboard", label: "首页 Dashboard" },
  { path: "/preparations", label: "院内制剂库" },
  { path: "/projects", label: "研究项目管理" },
  { path: "/cases", label: "患者与病例管理" },
  { path: "/wounds", label: "创面图片管理" },
  { path: "/followups", label: "随访管理" },
  { path: "/sops", label: "SOP中心" },
  { path: "/ai-assistant", label: "AI科研助手" },
  { path: "/statistics", label: "统计分析" },
  { path: "/transformation", label: "循证转化中心" },
  { path: "/compliance", label: "合规审计中心" },
  { path: "/permissions", label: "用户权限设置" },
  { path: "/system-settings", label: "系统设置" },
];
</script>
