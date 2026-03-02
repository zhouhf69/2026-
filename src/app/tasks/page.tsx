"use client";

import { useState, useMemo, Suspense } from "react";
import { useData, useDerivedData } from "@/context/DataContext";
import type { Task } from "@/types";
import { getToday, getWeekStart, getWeekEnd } from "@/lib/store";
import { useSearchParams } from "next/navigation";

export default function TasksPage() {
  return (
    <Suspense fallback={<div className="h-64 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />}>
      <TasksContent />
    </Suspense>
  );
}

function TasksContent() {
  const { tasks, papers, updateTask, loading } = useData();
  const searchParams = useSearchParams();
  const highlight = searchParams.get("highlight");
  const [filterPaperId, setFilterPaperId] = useState<string>("all");

  const today = getToday();
  const weekStart = getWeekStart(new Date());
  const weekEnd = getWeekEnd(new Date());

  const todayStr = today;
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().slice(0, 10);

  const { todayTasks, weekTasks, overdueTasks, tasksWithStatus } = useDerivedData();

  const filteredTasks = useMemo(() => {
    if (filterPaperId === "all") return tasksWithStatus;
    return tasksWithStatus.filter((t) => t.paperId === filterPaperId);
  }, [tasksWithStatus, filterPaperId]);

  const filteredOverdue = useMemo(
    () => overdueTasks.filter((t) => filterPaperId === "all" || t.paperId === filterPaperId),
    [overdueTasks, filterPaperId]
  );

  const byDate = useMemo(() => {
    const map: Record<string, typeof filteredTasks> = {};
    for (const t of filteredTasks) {
      if (t.effectiveStatus === "done") continue;
      if (!map[t.endDate]) map[t.endDate] = [];
      map[t.endDate].push(t);
    }
    for (const k of Object.keys(map)) {
      map[k].sort((a, b) => a.name.localeCompare(b.name));
    }
    return map;
  }, [filteredTasks]);

  const toggleDone = (id: string) => {
    const t = tasks.find((x) => x.id === id);
    if (!t) return;
    updateTask(id, { status: t.status === "done" ? "todo" : "done" });
  };

  const toggleBlocked = (id: string) => {
    const t = tasks.find((x) => x.id === id);
    if (!t) return;
    updateTask(id, { status: t.status === "blocked" ? "todo" : "blocked" });
  };

  const dates = [
    { label: "今天", date: todayStr, key: "today" },
    { label: "明天", date: tomorrowStr, key: "tomorrow" },
  ];

  const weekDates: { label: string; date: string }[] = [];
  const curr = new Date(weekStart);
  while (curr <= weekEnd) {
    const d = curr.toISOString().slice(0, 10);
    const isToday = d === todayStr;
    const isTomorrow = d === tomorrowStr;
    let label = d;
    if (isToday) label = "今天";
    else if (isTomorrow) label = "明天";
    else label = `${curr.getMonth() + 1}/${curr.getDate()}`;
    weekDates.push({ label, date: d });
    curr.setDate(curr.getDate() + 1);
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-36 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-40 animate-pulse rounded-xl border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800"
            />
          ))}
        </div>
        <div className="h-64 animate-pulse rounded-xl border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">任务中心</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500 dark:text-slate-400">论文：</span>
          <select
            value={filterPaperId}
            onChange={(e) => setFilterPaperId(e.target.value)}
            className="rounded border border-slate-200 px-2 py-1 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
            aria-label="筛选论文"
          >
            <option value="all">全部</option>
            {papers.map((p) => (
              <option key={p.id} value={p.id}>
                {p.id} {p.title}
              </option>
            ))}
          </select>
          {filterPaperId !== "all" && (
            <button
              onClick={() => setFilterPaperId("all")}
              className="rounded border border-slate-200 px-2 py-1 text-xs text-slate-500 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-400 dark:hover:bg-slate-700"
            >
              清空
            </button>
          )}
        </div>
      </div>

      {/* 逾期 */}
      {filteredOverdue.length > 0 && (
        <section className="rounded-xl border border-red-200 bg-red-50/50 p-4 dark:border-red-800 dark:bg-red-900/20">
          <h2 className="mb-3 font-semibold text-red-800 dark:text-red-200">逾期任务</h2>
          <ul className="space-y-2">
            {filteredOverdue.map((t) => (
              <TaskItem
                key={t.id}
                task={t}
                papers={papers}
                highlight={highlight === t.id}
                onToggleDone={toggleDone}
                onToggleBlocked={toggleBlocked}
                onStatusCycle={(id) => {
                  const found = tasks.find((x) => x.id === id);
                  if (!found) return;
                  const next: Task["status"][] = ["todo", "doing", "blocked", "done"];
                  const i = next.indexOf(found.status as Task["status"]);
                  updateTask(id, { status: next[(i + 1) % 4] });
                }}
                isOverdue
              />
            ))}
          </ul>
        </section>
      )}

      {/* 今天 / 明天 */}
      <div className="grid gap-4 md:grid-cols-2">
        {dates.map(({ label, date }) => {
          const dayTasks = byDate[date] ?? [];
          const isToday = date === todayStr;
          return (
          <section
            key={date}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800"
          >
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-semibold text-slate-800 dark:text-slate-100">{label} ({date})</h2>
              {isToday && dayTasks.length > 0 && (
                <button
                  onClick={() => dayTasks.forEach((t) => updateTask(t.id, { status: "done" }))}
                  className="rounded border border-slate-200 px-2 py-1 text-xs text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-400 dark:hover:bg-slate-700"
                  title="将今日任务全部标记为完成"
                >
                  全部完成
                </button>
              )}
            </div>
            {dayTasks.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">无任务</p>
            ) : (
              <ul className="space-y-2">
                {byDate[date].map((t) => (
                  <TaskItem
                    key={t.id}
                    task={t}
                    papers={papers}
                    highlight={highlight === t.id}
                    onToggleDone={toggleDone}
                    onToggleBlocked={toggleBlocked}
                    onStatusCycle={(id) => {
                      const t = tasks.find((x) => x.id === id);
                      if (!t) return;
                      const next: Task["status"][] = ["todo", "doing", "blocked", "done"];
                      const i = next.indexOf(t.status as Task["status"]);
                      updateTask(id, { status: next[(i + 1) % 4] });
                    }}
                  />
                ))}
              </ul>
            )}
          </section>
        )})}
      </div>

      {/* 本周 */}
      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold text-slate-800 dark:text-slate-100">
            本周 ({weekStart.toISOString().slice(0, 10)} ~ {weekEnd.toISOString().slice(0, 10)})
          </h2>
          {weekDates.some(({ date }) => (byDate[date] ?? []).length > 0) && (
            <button
              onClick={() => {
                weekDates.forEach(({ date }) => {
                  (byDate[date] ?? []).forEach((t) => updateTask(t.id, { status: "done" }));
                });
              }}
              className="rounded border border-slate-200 px-2 py-1 text-xs text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-400 dark:hover:bg-slate-700"
              title="将本周任务全部标记为完成"
            >
              本周全部完成
            </button>
          )}
        </div>
        <div className="space-y-4">
          {weekDates.map(({ label, date }) => (
            <div key={date}>
              <h3 className="mb-2 text-sm font-medium text-slate-600">{label}</h3>
              {!byDate[date] || byDate[date].length === 0 ? (
                <p className="text-sm text-slate-400 dark:text-slate-500">无</p>
              ) : (
                <ul className="space-y-2">
                  {byDate[date].map((t) => (
                    <TaskItem
                      key={t.id}
                      task={t}
                      papers={papers}
                      highlight={highlight === t.id}
                      onToggleDone={toggleDone}
                      onToggleBlocked={toggleBlocked}
                      onStatusCycle={(id) => {
                        const t = tasks.find((x) => x.id === id);
                        if (!t) return;
                        const next: Task["status"][] = ["todo", "doing", "blocked", "done"];
                        const i = next.indexOf(t.status as Task["status"]);
                        updateTask(id, { status: next[(i + 1) % 4] });
                      }}
                    />
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function TaskItem({
  task,
  papers,
  highlight,
  onToggleDone,
  onToggleBlocked,
  onStatusCycle,
  isOverdue,
}: {
  task: { id: string; name: string; paperId: string; assignee: string; status: string };
  papers: { id: string; title: string }[];
  highlight: boolean;
  onToggleDone: (id: string) => void;
  onToggleBlocked: (id: string) => void;
  onStatusCycle?: (id: string) => void;
  isOverdue?: boolean;
}) {
  const paper = papers.find((p) => p.id === task.paperId);
  const done = task.status === "done";
  const blocked = task.status === "blocked";
  const statusLabel =
    done ? "完成" : blocked ? "阻塞" : task.status === "doing" ? "进行中" : "待办";

  return (
    <li
      className={`flex items-center gap-3 rounded-lg border p-2 ${
        highlight ? "border-blue-400 bg-blue-50/50 dark:border-blue-600 dark:bg-blue-900/30" : "border-slate-100 dark:border-slate-700 dark:bg-slate-800"
      } ${done ? "opacity-60" : ""}`}
    >
      <button
        onClick={() => onToggleDone(task.id)}
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
          done ? "bg-green-500 border-green-600 text-white" : "border-slate-300"
        }`}
      >
        {done && "✓"}
      </button>
      <div className="min-w-0 flex-1">
        <div className={`font-medium ${done ? "line-through text-slate-500 dark:text-slate-400" : "text-slate-800 dark:text-slate-200"}`}>
          {task.name}
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400">
          {paper?.title} · {task.assignee}
        </div>
      </div>
      {onStatusCycle ? (
        <button
          onClick={() => onStatusCycle(task.id)}
          className={`rounded px-2 py-0.5 text-xs hover:opacity-80 ${
            done ? "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-200" : blocked ? "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200" : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
          }`}
          title="点击切换状态"
        >
          {statusLabel}
        </button>
      ) : (
        <button
          onClick={() => onToggleBlocked(task.id)}
          className={`rounded px-2 py-0.5 text-xs ${
            blocked ? "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200" : "bg-slate-100 text-slate-600 hover:bg-amber-50 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-amber-900/30"
          }`}
        >
          {blocked ? "已阻塞" : "阻塞"}
        </button>
      )}
      {isOverdue && (
        <span className="rounded bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900/50 dark:text-red-200">
          逾期
        </span>
      )}
    </li>
  );
}
