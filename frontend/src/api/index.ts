import { apiClient } from "./client";
import type { CaseItem, DashboardMetrics, PreparationItem, ProjectItem } from "@/types";

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
