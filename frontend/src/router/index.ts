import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", redirect: "/dashboard" },
    { path: "/login", component: () => import("@/views/LoginView.vue"), meta: { public: true } },
    { path: "/dashboard", component: () => import("@/views/DashboardView.vue") },
    { path: "/preparations", component: () => import("@/views/PreparationsListView.vue") },
    { path: "/preparations/new", component: () => import("@/views/PreparationFormView.vue") },
    { path: "/preparations/:id", component: () => import("@/views/PreparationDetailView.vue") },
    { path: "/projects", component: () => import("@/views/ProjectsListView.vue") },
    { path: "/projects/new", component: () => import("@/views/ProjectFormView.vue") },
    { path: "/projects/:id", component: () => import("@/views/ProjectDetailView.vue") },
    { path: "/cases", component: () => import("@/views/CasesListView.vue") },
    { path: "/cases/new", component: () => import("@/views/CaseFormView.vue") },
    { path: "/cases/:id", component: () => import("@/views/CaseDetailView.vue") },
    { path: "/wounds", component: () => import("@/views/WoundImagesView.vue") },
    { path: "/wounds/analysis/:id", component: () => import("@/views/WoundAnalysisDetailView.vue") },
    { path: "/followups", component: () => import("@/views/FollowupTasksView.vue") },
    { path: "/followups/record/:id", component: () => import("@/views/FollowupRecordView.vue") },
    { path: "/sops", component: () => import("@/views/SOPCenterView.vue") },
    { path: "/sops/edit/:id", component: () => import("@/views/SOPEditorView.vue") },
    { path: "/ai-assistant", component: () => import("@/views/AIResearchAssistantView.vue") },
    { path: "/statistics", component: () => import("@/views/StatisticsView.vue") },
    { path: "/transformation", component: () => import("@/views/TransformationCenterView.vue") },
    { path: "/compliance", component: () => import("@/views/ComplianceAuditView.vue") },
    { path: "/permissions", component: () => import("@/views/UserPermissionView.vue") },
    { path: "/system-settings", component: () => import("@/views/SystemSettingsView.vue") },
  ],
});

router.beforeEach((to) => {
  const auth = useAuthStore();
  if (to.meta.public) return true;
  if (!auth.isAuthed()) return "/login";
  return true;
});

export default router;
