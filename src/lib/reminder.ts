import type { Task } from "@/types";
import { getToday } from "./store";

const REMINDER_KEY = "paper-board-reminder";

export interface ReminderPrefs {
  enabled: boolean;
  lastShownDate: string | null;
}

export function getReminderPrefs(): ReminderPrefs {
  if (typeof window === "undefined") return { enabled: false, lastShownDate: null };
  try {
    const raw = localStorage.getItem(REMINDER_KEY);
    if (!raw) return { enabled: false, lastShownDate: null };
    const parsed = JSON.parse(raw) as ReminderPrefs;
    return { enabled: !!parsed.enabled, lastShownDate: parsed.lastShownDate ?? null };
  } catch {
    return { enabled: false, lastShownDate: null };
  }
}

export function setReminderPrefs(prefs: Partial<ReminderPrefs>): void {
  if (typeof window === "undefined") return;
  const current = getReminderPrefs();
  const next = { ...current, ...prefs };
  localStorage.setItem(REMINDER_KEY, JSON.stringify(next));
}

export interface ReminderSummary {
  overdue: Task[];
  todayDue: Task[];
  overdueCount: number;
  todayCount: number;
}

export function getReminderSummary(tasks: Task[]): ReminderSummary {
  const today = getToday();
  const overdue: Task[] = [];
  const todayDue: Task[] = [];
  for (const t of tasks) {
    if (t.status === "done") continue;
    if (t.endDate < today) overdue.push(t);
    else if (t.endDate === today) todayDue.push(t);
  }
  return {
    overdue,
    todayDue,
    overdueCount: overdue.length,
    todayCount: todayDue.length,
  };
}

export function shouldShowDailyReminder(): boolean {
  const prefs = getReminderPrefs();
  if (!prefs.enabled) return false;
  const today = getToday();
  const hour = new Date().getHours();
  if (hour < 9) return false;
  return prefs.lastShownDate !== today;
}

export function markReminderShown(): void {
  setReminderPrefs({ lastShownDate: getToday() });
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === "undefined" || !("Notification" in window))
    return "denied";
  if (Notification.permission === "granted") return "granted";
  if (Notification.permission === "denied") return "denied";
  return await Notification.requestPermission();
}

export function showReminderNotification(summary: ReminderSummary): void {
  if (typeof window === "undefined" || !("Notification" in window)) return;
  if (Notification.permission !== "granted") return;

  const parts: string[] = [];
  if (summary.overdueCount > 0) parts.push(`${summary.overdueCount} 个逾期`);
  if (summary.todayCount > 0) parts.push(`${summary.todayCount} 个今日到期`);
  const text = parts.length > 0 ? parts.join("，") : "暂无待办";

  new Notification("论文计划 · 每日提醒", {
    body: text,
    icon: "/icon.svg",
  });
}
