import { defineStore } from "pinia";
import { ref } from "vue";
import { login } from "@/api";

export const useAuthStore = defineStore("auth", () => {
  const token = ref<string | null>(localStorage.getItem("preprws-token"));
  const role = ref<string>(localStorage.getItem("preprws-role") || "SuperAdmin");

  const isAuthed = () => Boolean(token.value);

  async function signIn(username: string, password: string): Promise<void> {
    const accessToken = await login(username, password);
    token.value = accessToken;
    localStorage.setItem("preprws-token", accessToken);
    localStorage.setItem("preprws-role", role.value);
  }

  function signOut(): void {
    token.value = null;
    localStorage.removeItem("preprws-token");
  }

  return { token, role, isAuthed, signIn, signOut };
});
