<template>
  <MainLayout>
    <div class="space-y-4">
      <h2 class="text-lg font-semibold">用户权限设置（RBAC）</h2>
      <div class="grid gap-4 lg:grid-cols-3">
        <div class="rounded-xl border border-slate-800 bg-slate-900/60 p-4 lg:col-span-1">
          <p class="mb-2 text-sm font-medium text-slate-300">角色列表</p>
          <div class="space-y-2">
            <button
              v-for="role in roles"
              :key="role.id"
              class="w-full rounded border px-3 py-2 text-left text-sm transition"
              :class="selectedRole?.id === role.id ? 'border-medical-cyan bg-cyan-500/10' : 'border-slate-700 hover:bg-slate-800/60'"
              @click="selectedRole = role"
            >
              {{ role.code }} · {{ role.name }}
            </button>
          </div>
        </div>
        <div class="rounded-xl border border-slate-800 bg-slate-900/60 p-4 lg:col-span-2">
          <p class="text-sm text-slate-400">菜单 / 页面 / 按钮 / 导出 / 审核权限</p>
          <div v-if="selectedRole" class="mt-3 space-y-3 text-sm">
            <div>
              <p class="text-xs text-slate-400">菜单范围</p>
              <p>{{ selectedRole.menu_scope.join("、") }}</p>
            </div>
            <div>
              <p class="text-xs text-slate-400">页面范围</p>
              <p>{{ selectedRole.page_scope.join("、") }}</p>
            </div>
            <div>
              <p class="text-xs text-slate-400">按钮权限</p>
              <p>{{ selectedRole.button_scope.join("、") }}</p>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div class="rounded border border-slate-700 p-3">
                <p class="text-xs text-slate-400">导出权限</p>
                <p>{{ selectedRole.export_permission ? "允许" : "禁止" }}</p>
              </div>
              <div class="rounded border border-slate-700 p-3">
                <p class="text-xs text-slate-400">审核权限</p>
                <p>{{ selectedRole.review_permission ? "允许" : "禁止" }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { fetchRoleScopes } from "@/api";
import MainLayout from "@/components/layout/MainLayout.vue";
import { mockRoleScopes } from "@/mock/data";
import type { RoleScopeItem } from "@/types";

const roles = ref<RoleScopeItem[]>([]);
const selectedRole = ref<RoleScopeItem | null>(null);

onMounted(async () => {
  try {
    roles.value = await fetchRoleScopes();
  } catch {
    roles.value = mockRoleScopes;
  }
  selectedRole.value = roles.value[0] || null;
});
</script>
