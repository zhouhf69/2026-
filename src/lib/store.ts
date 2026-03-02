import type { Paper, Task, Milestone, StoreData } from "@/types";

const STORAGE_KEY = "paper-board-data";

export function getToday(): string {
  return new Date().toISOString().slice(0, 10);
}

export function getWeekStart(d: Date): Date {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(date.setDate(diff));
}

export function getWeekEnd(d: Date): Date {
  const start = getWeekStart(d);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  return end;
}

function toLocalDateStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function isInWeek(dateStr: string, refDate: Date): boolean {
  const start = getWeekStart(refDate);
  const end = getWeekEnd(refDate);
  const startStr = toLocalDateStr(start);
  const endStr = toLocalDateStr(end);
  return dateStr >= startStr && dateStr <= endStr;
}

export function daysUntil(dateStr: string): number {
  const today = new Date(getToday());
  const target = new Date(dateStr);
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export function computeTaskStatus(task: Task): Task["status"] {
  if (task.status === "done") return "done";
  const today = getToday();
  if (task.endDate < today) return "overdue";
  return task.status;
}

export function computePaperProgress(paperId: string, tasks: Task[]): number {
  const paperTasks = tasks.filter((t) => t.paperId === paperId);
  if (paperTasks.length === 0) return 0;
  const done = paperTasks.filter((t) => t.status === "done").length;
  return Math.round((done / paperTasks.length) * 100);
}

export function isHighRisk(paper: Paper, tasks: Task[]): boolean {
  const days = daysUntil(paper.plannedSubmitDate);
  const progress = computePaperProgress(paper.id, tasks);
  return days < 14 && days >= 0 && progress < 60;
}

/** 红黄绿灯风险：red < 3天；yellow 3-7天；orange 7-14天；green >= 14天 或 进度>=60% */
export type RiskSignal = "red" | "yellow" | "orange" | "green";

export function getRiskSignal(paper: Paper, tasks: Task[]): RiskSignal {
  const days = daysUntil(paper.plannedSubmitDate);
  const progress = computePaperProgress(paper.id, tasks);
  if (progress >= 60 || days < 0) return "green";
  if (days < 3) return "red";
  if (days < 7) return "yellow";
  if (days < 14) return "orange";
  return "green";
}

export async function loadData(): Promise<StoreData> {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored) as StoreData;
      } catch {
        // fall through to seed
      }
    }
  }
  const res = await fetch("/seed.json");
  return res.json();
}

export function saveData(data: StoreData): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
}
