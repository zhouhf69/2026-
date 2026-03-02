"use client";

import { useState, useMemo, useEffect } from "react";
import { useData, useDerivedData } from "@/context/DataContext";
import { computePaperProgress, isHighRisk, daysUntil, getRiskSignal } from "@/lib/store";
import {
  shouldShowDailyReminder,
  markReminderShown,
  getReminderSummary,
  requestNotificationPermission,
  showReminderNotification,
} from "@/lib/reminder";
import Link from "next/link";
import type { Track, Task } from "@/types";

const TRACKS: Track[] = ["AI治理", "NETs", "DIP", "专科RWE", "筛查"];

export default function DashboardPage() {
  const { papers, tasks, loading, updateTask } = useData();
  const {
    overdueTasks,
    todayTasks,
    weekTasks,
    submittedCount,
    revisionCount,
    acceptedCount,
    today,
  } = useDerivedData();

  const [filterTrack, setFilterTrack] = useState<string>("all");
  const weekDueCount = weekTasks.length;
  const overdueCount = overdueTasks.length;
  const highRiskCount = papers.filter((p) => isHighRisk(p, tasks)).length;

  useEffect(() => {
    if (loading || !shouldShowDailyReminder()) return;
    const run = async () => {
      const perm = await requestNotificationPermission();
      if (perm !== "granted") return;
      const summary = getReminderSummary(tasks);
      showReminderNotification(summary);
      markReminderShown();
    };
    run();
  }, [loading, tasks]);

  const filteredPapers = useMemo(
    () =>
      filterTrack === "all"
        ? papers
        : papers.filter((p) => p.track === filterTrack),
    [papers, filterTrack]
  );

  const trackStats = useMemo(() => {
    return TRACKS.map((track) => {
      const trackPapers = papers.filter((p) => p.track === track);
      const total = trackPapers.length;
      const avgProgress =
        total === 0
          ? 0
          : Math.round(
              trackPapers.reduce((acc, p) => acc + computePaperProgress(p.id, tasks), 0) / total
            );
      const submitted = trackPapers.filter((p) => p.status === "已投稿").length;
      return { track, total, avgProgress, submitted };
    }).filter((s) => s.total > 0);
  }, [papers, tasks]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-32 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-xl border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800"
            />
          ))}
        </div>
        <div className="h-32 animate-pulse rounded-xl border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800" />
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-28 animate-pulse rounded-lg border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">总览 Dashboard</h1>

      {/* 今日提醒 */}
      {(overdueCount > 0 || todayTasks.length > 0) && (
        <div
          className={`flex flex-wrap items-center justify-between gap-3 rounded-xl border p-3 ${
            overdueCount > 0
              ? "border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-900/30 dark:text-red-200"
              : "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-200"
          }`}
        >
          <span>
            {overdueCount > 0 ? (
              <>⚠ 有 {overdueCount} 个任务已逾期，请优先处理</>
            ) : (
              <>📋 今日有 {todayTasks.length} 个任务待完成</>
            )}
          </span>
          <Link
            href="/tasks"
            className="rounded border border-current/30 px-2 py-1 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/10"
          >
            去任务中心 →
          </Link>
        </div>
      )}

      {/* 8篇目标进度 */}
      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <h2 className="mb-2 font-semibold text-slate-800 dark:text-slate-100">2026 年度目标：8 篇论文</h2>
        <div className="flex items-center gap-4">
          <div className="min-w-0 flex-1">
            <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-600">
              <div
                className="h-full bg-slate-600 transition-all dark:bg-slate-400"
                style={{ width: `${Math.min(100, (papers.length / 8) * 100)}%` }}
              />
            </div>
          </div>
          <span className="shrink-0 text-sm font-medium text-slate-600 dark:text-slate-400">
            {papers.length} / 8 篇
          </span>
        </div>
        <div className="mt-2 flex flex-wrap gap-4 text-xs text-slate-500 dark:text-slate-400">
          <span>已投稿 {submittedCount}</span>
          <span>返修中 {revisionCount}</span>
          <span>已接收 {acceptedCount}</span>
        </div>
        {trackStats.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-3 border-t border-slate-200 pt-3 dark:border-slate-600">
            {trackStats.map(({ track, total, avgProgress, submitted }) => (
              <div
                key={track}
                className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-700/50"
              >
                <span className="font-medium text-slate-700 dark:text-slate-200">{track}</span>
                <span className="ml-2 text-slate-500 dark:text-slate-400">
                  {total} 篇 · 均 {avgProgress}% · 已投 {submitted}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* KPI 卡片 */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <KpiCard
          title="已投稿"
          value={submittedCount}
          sub="今年 8 篇"
          color="blue"
        />
        <KpiCard
          title="返修中"
          value={revisionCount}
          sub="进行中"
          color="amber"
        />
        <KpiCard
          title="已接收"
          value={acceptedCount}
          sub="目标"
          color="green"
        />
        <KpiCard
          title="本周到期"
          value={weekDueCount}
          sub="任务数"
          color="slate"
        />
        <KpiCard
          title="逾期任务"
          value={overdueCount}
          sub="需优先处理"
          color="red"
        />
        <KpiCard
          title="高风险论文"
          value={highRiskCount}
          sub="投稿前14天且进度不足60%"
          color="red"
          href={highRiskCount > 0 ? "/papers?risk=high" : undefined}
        />
        <KpiCard
          title="论文总数"
          value={papers.length}
          sub={`${TRACKS.length} 个赛道`}
          color="slate"
        />
      </div>

      {/* 逾期清单（置顶） */}
      {overdueTasks.length > 0 && (
        <section className="rounded-xl border border-red-200 bg-red-50/50 p-4 dark:border-red-800 dark:bg-red-900/20">
          <h2 className="mb-3 flex items-center gap-2 font-semibold text-red-800 dark:text-red-200">
            <span className="h-2 w-2 rounded-full bg-red-500" />
            逾期任务（置顶）
          </h2>
          <ul className="space-y-2">
            {overdueTasks.map((t) => (
              <TaskRow key={t.id} task={t} papers={papers} updateTask={updateTask} overdue />
            ))}
          </ul>
        </section>
      )}

      {/* 今日任务 */}
      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <h2 className="mb-3 font-semibold text-slate-800 dark:text-slate-100">今日任务 ({today})</h2>
        {todayTasks.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">今日无到期任务</p>
        ) : (
          <ul className="space-y-2">
            {todayTasks.map((t) => (
              <TaskRow key={t.id} task={t} papers={papers} updateTask={updateTask} />
            ))}
          </ul>
        )}
      </section>

      {/* 本周里程碑 */}
      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <h2 className="mb-3 font-semibold text-slate-800 dark:text-slate-100">本周关键节点</h2>
        {weekTasks.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">本周无到期任务</p>
        ) : (
          <ul className="space-y-2">
            {weekTasks
              .sort((a, b) => a.endDate.localeCompare(b.endDate))
              .map((t) => (
                <TaskRow key={t.id} task={t} papers={papers} updateTask={updateTask} showDate />
              ))}
          </ul>
        )}
      </section>

      {/* 论文列表快捷入口 */}
      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-semibold text-slate-800 dark:text-slate-100">论文列表</h2>
          <div className="flex items-center gap-2">
            <Link
              href="/papers"
              className="rounded border border-slate-200 px-2 py-1 text-sm text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-400 dark:hover:bg-slate-700"
            >
              查看全部
            </Link>
            <Link
              href="/papers"
              className="rounded bg-slate-800 px-2 py-1 text-sm text-white hover:bg-slate-700 dark:bg-slate-600 dark:hover:bg-slate-500"
            >
              + 新增论文
            </Link>
            <select
              value={filterTrack}
              onChange={(e) => setFilterTrack(e.target.value)}
              className="rounded border border-slate-200 bg-white px-2 py-1 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
              aria-label="按赛道筛选"
            >
            <option value="all">全部赛道</option>
            {TRACKS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          </div>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {filteredPapers.map((p) => {
            const progress = computePaperProgress(p.id, tasks);
            const signal = getRiskSignal(p, tasks);
            const days = daysUntil(p.plannedSubmitDate);
            const riskConfig = {
              red: { border: "border-red-300 dark:border-red-700", bg: "bg-red-50/30 dark:bg-red-900/20", badge: "bg-red-100 text-red-700 dark:bg-red-800/50 dark:text-red-200", label: "红灯 <3天" },
              yellow: { border: "border-amber-300 dark:border-amber-700", bg: "bg-amber-50/30 dark:bg-amber-900/20", badge: "bg-amber-100 text-amber-700 dark:bg-amber-800/50 dark:text-amber-200", label: "黄灯 3-7天" },
              orange: { border: "border-orange-300 dark:border-orange-700", bg: "bg-orange-50/30 dark:bg-orange-900/20", badge: "bg-orange-100 text-orange-700 dark:bg-orange-800/50 dark:text-orange-200", label: "橙灯 7-14天" },
              green: { border: "border-slate-200 dark:border-slate-600", bg: "", badge: "", label: "" },
            }[signal];
            return (
              <Link
                key={p.id}
                href={`/papers/${p.id}`}
                className={`rounded-lg border p-3 transition hover:shadow-md dark:bg-slate-800/50 ${
                  signal !== "green" ? `${riskConfig.border} ${riskConfig.bg}` : "border-slate-200 dark:border-slate-600"
                }`}
              >
                <div className="flex items-start justify-between">
                  <span className="font-medium text-slate-800 dark:text-slate-200">{p.title}</span>
                  {signal !== "green" && (
                    <span className={`rounded px-1.5 py-0.5 text-xs ${riskConfig.badge}`}>
                      {riskConfig.label}
                    </span>
                  )}
                </div>
                <div className="mt-2 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span>进度 {progress}%</span>
                  <span>·</span>
                  <span>投稿 {days > 0 ? `${days}天后` : "已过"}</span>
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-600">
                  <div
                    className="h-full bg-slate-600 transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </Link>
            );
          })}
        </div>
        <div className="mt-2 text-center">
          <Link href="/papers" className="text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
            查看全部论文 →
          </Link>
        </div>
      </section>
    </div>
  );
}

function KpiCard({
  title,
  value,
  sub,
  color,
  href,
}: {
  title: string;
  value: number;
  sub: string;
  color: "blue" | "amber" | "green" | "slate" | "red";
  href?: string;
}) {
  const colors = {
    blue: "border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-200",
    amber: "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-200",
    green: "border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-900/30 dark:text-green-200",
    slate: "border-slate-200 bg-slate-50 text-slate-800 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200",
    red: "border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-900/30 dark:text-red-200",
  };
  const content = (
    <>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm font-medium opacity-90">{title}</div>
      <div className="text-xs opacity-75">{sub}</div>
    </>
  );
  const className = `rounded-xl border p-4 transition hover:opacity-90 ${colors[color]} ${href ? "cursor-pointer" : ""}`;
  return href ? (
    <Link href={href} className={className} title="查看高风险论文">
      {content}
    </Link>
  ) : (
    <div className={className}>{content}</div>
  );
}

function TaskRow({
  task,
  papers,
  updateTask,
  overdue,
  showDate,
}: {
  task: { id: string; name: string; paperId: string; endDate: string; assignee: string; status: string };
  papers: { id: string; title: string }[];
  updateTask: (id: string, patch: Partial<Task>) => void;
  overdue?: boolean;
  showDate?: boolean;
}) {
  const paper = papers.find((p) => p.id === task.paperId);
  const done = task.status === "done";
  return (
    <li className="flex items-center justify-between rounded-lg border border-slate-100 bg-white p-2 dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-center gap-2">
        <button
          onClick={() => updateTask(task.id, { status: done ? "todo" : "done" })}
          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
            done ? "bg-green-500 border-green-600 text-white" : "border-slate-300 dark:border-slate-500"
          }`}
        >
          {done && "✓"}
        </button>
        <Link
          href={`/tasks?highlight=${task.id}`}
          className={`font-medium hover:underline ${done ? "line-through text-slate-500 dark:text-slate-400" : "text-slate-800 dark:text-slate-200"}`}
        >
          {task.name}
        </Link>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          {paper?.title} · {task.assignee}
        </span>
        {showDate && (
          <span className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-600 dark:bg-slate-700 dark:text-slate-300">
            {task.endDate}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        {overdue && (
          <span className="rounded bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900/50 dark:text-red-200">
            逾期
          </span>
        )}
      </div>
    </li>
  );
}
