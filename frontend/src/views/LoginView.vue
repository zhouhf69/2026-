<template>
  <div class="flex min-h-screen items-center justify-center bg-gradient-to-br from-medical-900 via-slate-950 to-black px-4">
    <div class="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl">
      <h1 class="text-2xl font-semibold text-medical-gold">PrepRWS AI</h1>
      <p class="mt-2 text-sm text-slate-400">登录后进入院内制剂真实世界研究工作台</p>
      <form class="mt-6 space-y-4" @submit.prevent="handleLogin">
        <div>
          <label class="mb-1 block text-xs text-slate-400">用户名</label>
          <input v-model="username" class="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2" />
        </div>
        <div>
          <label class="mb-1 block text-xs text-slate-400">密码</label>
          <input v-model="password" type="password" class="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2" />
        </div>
        <button class="w-full rounded-lg bg-medical-cyan py-2 font-medium text-slate-900 hover:opacity-90">登录</button>
        <button type="button" class="w-full rounded-lg border border-slate-700 py-2 text-sm hover:bg-slate-800/70" @click="handleDemoLogin">
          离线演示登录
        </button>
        <p class="text-xs text-slate-500">演示账号：admin / Admin123!</p>
        <p v-if="error" class="text-xs text-rose-400">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const auth = useAuthStore();
const username = ref("admin");
const password = ref("Admin123!");
const error = ref("");

async function handleLogin() {
  try {
    await auth.signIn(username.value, password.value);
    router.push("/dashboard");
  } catch (err) {
    error.value = "登录失败，请检查账号密码或后端服务状态";
    console.error(err);
  }
}

function handleDemoLogin() {
  auth.demoSignIn();
  router.push("/dashboard");
}
</script>
