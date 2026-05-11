import { apiClient } from "./client";
import type {
  CaseItem,
  DashboardMetrics,
  PreparationItem,
  ProjectItem,
  RoleScopeItem,
  SystemConfig,
  TransformationItem,
} from "@/types";

export async function login(username: string, password: string): Promise<string> {
  const { data } = await apiClient.post("/auth/login", { username, password });
  return data.access_token as string;
}

export async function fetchDashboard(): Promise<DashboardMetrics> {
  const { data } = await apiClient.get("/dashboard/overview");
  return data.metrics as DashboardMetrics;
}

export async function fetchPreparations(): Promise<PreparationItem[]> {
  const { data } = await apiClient.get("/preparations");
  return data as PreparationItem[];
}

export async function fetchProjects(): Promise<ProjectItem[]> {
  const { data } = await apiClient.get("/projects");
  return data as ProjectItem[];
}

export async function fetchCases(): Promise<CaseItem[]> {
  const { data } = await apiClient.get("/cases");
  return data as CaseItem[];
}

export async function fetchTransformationProjects(): Promise<TransformationItem[]> {
  const { data } = await apiClient.get("/transformation/projects");
  return data as TransformationItem[];
}

export async function createTransformationProject(payload: {
  transformation_name: string;
  evidence_level?: string;
  market_potential?: string;
  phase: string;
  milestones?: string;
}): Promise<TransformationItem> {
  const { data } = await apiClient.post("/transformation/projects", payload);
  return data as TransformationItem;
}

export async function fetchRoleScopes(): Promise<RoleScopeItem[]> {
  const { data } = await apiClient.get("/settings/roles");
  return data as RoleScopeItem[];
}

export async function fetchSystemConfig(): Promise<SystemConfig> {
  const { data } = await apiClient.get("/settings/system-config");
  return data as SystemConfig;
}

export async function fetchStatisticsOverview(): Promise<{
  summary: {
    project_count: number;
    case_count: number;
    preparation_count: number;
    adverse_event_count: number;
    followup_completion_rate: number;
  };
  charts: {
    healing_curve: number[];
    followup_funnel: Array<{ stage: string; value: number }>;
    preparation_usage: Array<{ name: string; value: number }>;
  };
}> {
  const { data } = await apiClient.get("/statistics/overview");
  return data;
}
