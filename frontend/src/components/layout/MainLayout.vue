<template>
  <div :class="containerClass" class="min-h-screen transition-colors">
    <div class="flex">
      <aside :class="asideClass" class="hidden w-72 border-r p-4 lg:block">
        <h1 class="text-lg font-semibold text-medical-gold">PrepRWS AI</h1>
        <p :class="subTextClass" class="mt-1 text-xs">AI辅助院内制剂真实世界研究与循证转化平台</p>
        <nav class="mt-6 space-y-1">
          <RouterLink
            v-for="item in menus"
            :key="item.path"
            :to="item.path"
            :class="menuClass"
            class="block rounded-lg px-3 py-2 text-sm transition"
            active-class="bg-slate-700 text-medical-cyan dark:bg-slate-700"
          >
            {{ item.label }}
          </RouterLink>
        </nav>
      </aside>
      <main class="w-full">
        <header :class="headerClass" class="border-b px-6 py-4 backdrop-blur">
          <div class="flex items-center justify-between gap-4">
            <div>
              <p class="text-base font-semibold">让经验方成为证据资产，让院内制剂走向循证转化。</p>
              <p :class="subTextClass" class="text-xs">面向经典名方、外用药与院内制剂的AI真实世界研究操作系统。</p>
            </div>
            <div class="flex items-center gap-2">
              <select
                v-model="theme"
                :class="inputClass"
                class="rounded-lg border px-2 py-2 text-xs outline-none ring-medical-cyan focus:ring-2"
                @change="applyTheme"
              >
                <option value="deep">深蓝主题</option>
                <option value="blackgold">黑金主题</option>
                <option value="light">白色主题</option>
              </select>
              <input
                type="text"
                placeholder="搜索项目 / 制剂 / 病例"
                :class="inputClass"
                class="w-72 rounded-lg border px-3 py-2 text-sm outline-none ring-medical-cyan focus:ring-2"
              />
            </div>
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
import { computed, ref } from "vue";

type ThemeKey = "deep" | "blackgold" | "light";
const theme = ref<ThemeKey>((localStorage.getItem("preprws-theme") as ThemeKey) || "deep");

const themeMap: Record<ThemeKey, { container: string; aside: string; header: string; input: string; menu: string; sub: string }> = {
  deep: {
    container: "bg-medical-900 text-slate-100",
    aside: "border-slate-800 bg-medical-800",
    header: "border-slate-800 bg-slate-900/80",
    input: "border-slate-700 bg-slate-900 text-slate-100",
    menu: "text-slate-200 hover:bg-slate-700/60",
    sub: "text-slate-400",
  },
  blackgold: {
    container: "bg-black text-slate-100",
    aside: "border-zinc-800 bg-zinc-950",
    header: "border-zinc-800 bg-zinc-950/90",
    input: "border-zinc-700 bg-zinc-900 text-slate-100",
    menu: "text-slate-200 hover:bg-zinc-800/80",
    sub: "text-zinc-400",
  },
  light: {
    container: "bg-slate-100 text-slate-900",
    aside: "border-slate-300 bg-white",
    header: "border-slate-300 bg-white/90",
    input: "border-slate-300 bg-white text-slate-900",
    menu: "text-slate-700 hover:bg-slate-200",
    sub: "text-slate-500",
  },
};

const containerClass = computed(() => themeMap[theme.value].container);
const asideClass = computed(() => themeMap[theme.value].aside);
const headerClass = computed(() => themeMap[theme.value].header);
const inputClass = computed(() => themeMap[theme.value].input);
const menuClass = computed(() => themeMap[theme.value].menu);
const subTextClass = computed(() => themeMap[theme.value].sub);

function applyTheme() {
  localStorage.setItem("preprws-theme", theme.value);
}

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
