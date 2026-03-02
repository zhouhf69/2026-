"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useData } from "@/context/DataContext";
import type { DocLink, Paper, Task, Track } from "@/types";
import { computePaperProgress, getRiskSignal, daysUntil } from "@/lib/store";
import Link from "next/link";

const TRACKS: Track[] = ["AI治理", "NETs", "DIP", "专科RWE", "筛查"];

export default function PaperDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { papers, tasks, updateTask, updatePaper, addTask, deleteTask, deletePaper } = useData();

  const paper = papers.find((p) => p.id === id);
  const paperTasks = tasks.filter((t) => t.paperId === id);
  const progress = paper ? computePaperProgress(paper.id, tasks) : 0;
  const signal = paper ? getRiskSignal(paper, tasks) : "green";
  const days = paper ? daysUntil(paper.plannedSubmitDate) : 0;
  const riskLabels: Record<string, string> = {
    red: "红灯 <3天",
    yellow: "黄灯 3-7天",
    orange: "橙灯 7-14天",
    green: "",
  };

  if (!paper) {
    return (
      <div className="py-12 text-center">
        <p className="text-slate-500 dark:text-slate-400">未找到该论文</p>
        <Link href="/dashboard" className="mt-2 text-blue-600 hover:underline dark:text-blue-400">
          返回总览
        </Link>
      </div>
    );
  }

  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editingPaper, setEditingPaper] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    navigator.clipboard?.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }).catch(() => {});
  };

  const toggleTask = (taskId: string) => {
    const t = tasks.find((x) => x.id === taskId);
    if (!t) return;
    updateTask(taskId, { status: t.status === "done" ? "todo" : "done" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{paper.title}</h1>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <span>{paper.track}</span>
            <span>·</span>
            <span>计划投稿：{paper.plannedSubmitDate}</span>
            <select
              value={paper.status}
              onChange={(e) => updatePaper(paper.id, { status: e.target.value as Paper["status"] })}
              className="rounded border border-slate-200 bg-white px-2 py-0.5 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
              aria-label="论文状态"
            >
              <option value="规划">规划</option>
              <option value="写作">写作</option>
              <option value="内审">内审</option>
              <option value="已投稿">已投稿</option>
              <option value="返修">返修</option>
              <option value="接收">接收</option>
              <option value="拒稿">拒稿</option>
            </select>
            {signal !== "green" && (
              <span
                className={`rounded px-2 py-0.5 text-xs ${
                  signal === "red"
                    ? "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-200"
                    : signal === "yellow"
                    ? "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-200"
                    : "bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-200"
                }`}
              >
                {riskLabels[signal]}
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/papers"
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
          >
            ← 论文列表
          </Link>
          <Link
            href="/gantt"
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
          >
            甘特图
          </Link>
          <button
            onClick={copyLink}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
            title="复制当前页面链接"
          >
            {copied ? "已复制" : "复制链接"}
          </button>
          <button
            onClick={() => setEditingPaper(true)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
          >
            编辑论文
          </button>
          <button
            onClick={() => {
              if (confirm(`确定删除论文「${paper.title}」？\n\n将同时删除其下所有任务。`)) {
                deletePaper(paper.id, true);
                router.push("/papers");
              }
            }}
            className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 dark:border-red-800 dark:bg-slate-700 dark:text-red-400 dark:hover:bg-red-900/30"
          >
            删除论文
          </button>
        </div>
      </div>

      {/* 进度条 */}
      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-slate-800 dark:text-slate-100">进度</h2>
          <span className="text-sm text-slate-500 dark:text-slate-400">
            {days > 0 ? `距投稿 ${days} 天` : "已过投稿日"}
          </span>
        </div>
        <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-600">
          <div
            className="h-full bg-slate-600 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {paperTasks.filter((t) => t.status === "done").length} / {paperTasks.length} 任务完成
        </div>
      </section>

      {/* 目标期刊 */}
      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <h2 className="font-semibold text-slate-800 dark:text-slate-100">目标期刊</h2>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">点击可编辑</p>
        <div className="mt-2 grid gap-2 sm:grid-cols-3">
          <div className="rounded-lg border border-slate-200 p-2 dark:border-slate-600">
            <div className="text-xs text-slate-500 dark:text-slate-400">冲刺</div>
            <input
              type="text"
              value={paper.targetJournals.stretch ?? ""}
              onChange={(e) =>
                updatePaper(paper.id, {
                  targetJournals: { ...paper.targetJournals, stretch: e.target.value },
                })
              }
              placeholder="未设置"
              className="mt-0.5 w-full border-0 border-b border-transparent bg-transparent font-medium focus:border-slate-300 focus:outline-none"
            />
          </div>
          <div className="rounded-lg border border-slate-200 p-2 dark:border-slate-600">
            <div className="text-xs text-slate-500 dark:text-slate-400">主投</div>
            <input
              type="text"
              value={paper.targetJournals.main ?? ""}
              onChange={(e) =>
                updatePaper(paper.id, {
                  targetJournals: { ...paper.targetJournals, main: e.target.value },
                })
              }
              placeholder="未设置"
              className="mt-0.5 w-full border-0 border-b border-transparent bg-transparent font-medium focus:border-slate-300 focus:outline-none"
            />
          </div>
          <div className="rounded-lg border border-slate-200 p-2 dark:border-slate-600">
            <div className="text-xs text-slate-500 dark:text-slate-400">保底</div>
            <input
              type="text"
              value={paper.targetJournals.fallback ?? ""}
              onChange={(e) =>
                updatePaper(paper.id, {
                  targetJournals: { ...paper.targetJournals, fallback: e.target.value },
                })
              }
              placeholder="未设置"
              className="mt-0.5 w-full border-0 border-b border-transparent bg-transparent font-medium focus:border-slate-300 focus:outline-none"
            />
          </div>
        </div>
      </section>

      {/* 任务列表 */}
      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold text-slate-800 dark:text-slate-100">任务列表</h2>
          <AddTaskButton paperId={paper.id} addTask={addTask} assignees={["周宏锋", "学术秘书", "数据负责人", "写作支持"]} />
        </div>
        <ul className="space-y-2">
          {paperTasks
            .sort((a, b) => a.startDate.localeCompare(b.startDate))
            .map((t) => {
              const unmetDeps =
                t.dependsOn?.filter((depId) => {
                  const dep = tasks.find((x) => x.id === depId);
                  return dep && dep.status !== "done";
                }) ?? [];
              const hasUnmetDeps = unmetDeps.length > 0 && t.status !== "done";
              return (
              <li
                key={t.id}
                className={`flex items-center gap-3 rounded-lg border p-2 ${
                  t.status === "done" ? "border-slate-100 bg-slate-50/50 dark:border-slate-700 dark:bg-slate-800/50" : hasUnmetDeps ? "border-amber-200 bg-amber-50/30 dark:border-amber-700 dark:bg-amber-900/20" : "border-slate-100 dark:border-slate-700 dark:bg-slate-800"
                }`}
              >
                <button
                  onClick={() => toggleTask(t.id)}
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                    t.status === "done" ? "bg-green-500 border-green-600 text-white" : "border-slate-300 dark:border-slate-500"
                  }`}
                >
                  {t.status === "done" && "✓"}
                </button>
                <div className="min-w-0 flex-1">
                  <div
                    className={`font-medium ${
                      t.status === "done" ? "line-through text-slate-500 dark:text-slate-400" : "text-slate-800 dark:text-slate-200"
                    }`}
                  >
                    {t.name}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {t.startDate} ~ {t.endDate} · {t.assignee}
                    {hasUnmetDeps && (
                      <span className="ml-1 text-amber-600 dark:text-amber-400">
                        · 依赖未完成
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => {
                    const next: Task["status"][] = ["todo", "doing", "blocked", "done"];
                    const i = next.indexOf(t.status as Task["status"]);
                    updateTask(t.id, { status: next[(i + 1) % 4] });
                  }}
                  className={`rounded px-2 py-0.5 text-xs ${
                    t.status === "done"
                      ? "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-200"
                      : t.endDate < new Date().toISOString().slice(0, 10)
                      ? "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-200"
                      : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                  } hover:opacity-80`}
                  title="点击切换状态"
                >
                  {t.status === "done"
                    ? "完成"
                    : t.endDate < new Date().toISOString().slice(0, 10)
                    ? "逾期"
                    : t.status === "doing"
                    ? "进行中"
                    : t.status === "blocked"
                    ? "阻塞"
                    : "待办"}
                </button>
                <button
                  onClick={() => setEditingTask(t)}
                  className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-300"
                  title="编辑任务"
                  aria-label="编辑任务"
                >
                  ✎
                </button>
                <button
                  onClick={() => confirm("确定删除此任务？") && deleteTask(t.id)}
                  className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-300"
                  title="删除任务"
                  aria-label="删除任务"
                >
                  ✕
                </button>
              </li>
              );
            })}
        </ul>
      </section>

      {editingTask && (
        <EditTaskModal
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onSave={(patch) => {
            updateTask(editingTask.id, patch);
            setEditingTask(null);
          }}
          assignees={["周宏锋", "学术秘书", "数据负责人", "写作支持"]}
        />
      )}

      {editingPaper && (
        <EditPaperModal
          paper={paper}
          onClose={() => setEditingPaper(false)}
          onSave={(patch) => {
            updatePaper(paper.id, patch);
            setEditingPaper(false);
          }}
          tracks={TRACKS}
        />
      )}

      {/* 文档链接区 */}
      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <h2 className="font-semibold text-slate-800 dark:text-slate-100">文档链接</h2>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          支持 Google Doc、Notion、本地路径等 URL
        </p>
        <DocLinksEditor
          links={paper.docLinks ?? []}
          onChange={(docLinks) => updatePaper(paper.id, { docLinks })}
        />
      </section>
    </div>
  );
}

function EditPaperModal({
  paper,
  onClose,
  onSave,
  tracks,
}: {
  paper: Paper;
  onClose: () => void;
  onSave: (patch: Partial<Paper>) => void;
  tracks: Track[];
}) {
  const [title, setTitle] = useState(paper.title);
  const [track, setTrack] = useState<Track>(paper.track);
  const [status, setStatus] = useState<Paper["status"]>(paper.status);
  const [plannedSubmitDate, setPlannedSubmitDate] = useState(paper.plannedSubmitDate);
  const [stretch, setStretch] = useState(paper.targetJournals.stretch ?? "");
  const [main, setMain] = useState(paper.targetJournals.main ?? "");
  const [fallback, setFallback] = useState(paper.targetJournals.fallback ?? "");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({
      title: title.trim(),
      track,
      status,
      plannedSubmitDate,
      targetJournals: { stretch: stretch || undefined, main: main || undefined, fallback: fallback || undefined },
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-xl bg-white p-4 shadow-xl dark:bg-slate-800 dark:border dark:border-slate-700"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-semibold text-slate-800 dark:text-slate-100">编辑论文</h3>
        <div className="mt-3 space-y-2">
          <input
            type="text"
            placeholder="论文标题 *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded border border-slate-200 px-2 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:placeholder-slate-400"
          />
          <div className="flex gap-2">
            <select
              value={track}
              onChange={(e) => setTrack(e.target.value as Track)}
              className="flex-1 rounded border border-slate-200 px-2 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
              aria-label="赛道"
            >
              {tracks.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as Paper["status"])}
              className="flex-1 rounded border border-slate-200 px-2 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
              aria-label="状态"
            >
              <option value="规划">规划</option>
              <option value="写作">写作</option>
              <option value="内审">内审</option>
              <option value="已投稿">已投稿</option>
              <option value="返修">返修</option>
              <option value="接收">接收</option>
              <option value="拒稿">拒稿</option>
            </select>
          </div>
          <input
            type="date"
            value={plannedSubmitDate}
            onChange={(e) => setPlannedSubmitDate(e.target.value)}
            className="w-full rounded border border-slate-200 px-2 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
            aria-label="计划投稿日期"
          />
          <div className="grid gap-2 sm:grid-cols-3">
            <input
              type="text"
              placeholder="冲刺期刊"
              value={stretch}
              onChange={(e) => setStretch(e.target.value)}
              className="rounded border border-slate-200 px-2 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:placeholder-slate-400"
            />
            <input
              type="text"
              placeholder="主投期刊"
              value={main}
              onChange={(e) => setMain(e.target.value)}
              className="rounded border border-slate-200 px-2 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:placeholder-slate-400"
            />
            <input
              type="text"
              placeholder="保底期刊"
              value={fallback}
              onChange={(e) => setFallback(e.target.value)}
              className="rounded border border-slate-200 px-2 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:placeholder-slate-400"
            />
          </div>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            disabled={!title.trim()}
            className="rounded bg-slate-800 px-3 py-1.5 text-sm text-white hover:bg-slate-700 disabled:opacity-50 dark:bg-slate-600 dark:hover:bg-slate-500"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
}

function EditTaskModal({
  task,
  onClose,
  onSave,
  assignees,
}: {
  task: Task;
  onClose: () => void;
  onSave: (patch: Partial<Task>) => void;
  assignees: string[];
}) {
  const [name, setName] = useState(task.name);
  const [startDate, setStartDate] = useState(task.startDate);
  const [endDate, setEndDate] = useState(task.endDate);
  const [assignee, setAssignee] = useState(task.assignee);
  const [status, setStatus] = useState(task.status);
  const dateInvalid = endDate < startDate;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-xl bg-white p-4 shadow-xl dark:bg-slate-800 dark:border dark:border-slate-700"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-semibold text-slate-800 dark:text-slate-100">编辑任务</h3>
        <div className="mt-3 space-y-2">
          <input
            type="text"
            placeholder="任务名称"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded border border-slate-200 px-2 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:placeholder-slate-400"
          />
          <div className="flex gap-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="flex-1 rounded border border-slate-200 px-2 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
              aria-label="开始日期"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className={`flex-1 rounded border px-2 py-1.5 text-sm dark:bg-slate-700 dark:text-slate-200 ${dateInvalid ? "border-red-300 dark:border-red-600" : "border-slate-200 dark:border-slate-600"}`}
              aria-label="结束日期"
            />
          </div>
          {dateInvalid && (
            <p className="text-xs text-red-600 dark:text-red-400">结束日期不能早于开始日期</p>
          )}
          <select
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
            className="w-full rounded border border-slate-200 px-2 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
            aria-label="负责人"
          >
            {assignees.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as Task["status"])}
            className="w-full rounded border border-slate-200 px-2 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
            aria-label="状态"
          >
            <option value="todo">待办</option>
            <option value="doing">进行中</option>
            <option value="blocked">阻塞</option>
            <option value="done">完成</option>
          </select>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            取消
          </button>
          <button
            onClick={() => onSave({ name, startDate, endDate: dateInvalid ? startDate : endDate, assignee, status })}
            disabled={!name.trim()}
            className="rounded bg-slate-800 px-3 py-1.5 text-sm text-white hover:bg-slate-700 disabled:opacity-50 dark:bg-slate-600 dark:hover:bg-slate-500"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
}

function AddTaskButton({
  paperId,
  addTask,
  assignees,
}: {
  paperId: string;
  addTask: (task: { paperId: string; name: string; startDate: string; endDate: string; status: "todo"; assignee: string; dependsOn: string[]; checklist: { text: string; done: boolean }[]; riskLevel: "low" }) => void;
  assignees: string[];
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [assignee, setAssignee] = useState(assignees[0] ?? "周宏锋");

  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const handleSubmit = () => {
    if (!name.trim()) return;
    const start = startDate || today;
    const end = (endDate && endDate >= start) ? endDate : start;
    addTask({
      paperId,
      name: name.trim(),
      startDate: start,
      endDate: end,
      status: "todo",
      assignee,
      dependsOn: [],
      checklist: [],
      riskLevel: "low",
    });
    setName("");
    setStartDate("");
    setEndDate("");
    setOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
      >
        + 新增任务
      </button>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-xl bg-white p-4 shadow-xl dark:bg-slate-800 dark:border dark:border-slate-700"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-semibold text-slate-800 dark:text-slate-100">新增任务</h3>
            <div className="mt-3 space-y-2">
              <input
                type="text"
                placeholder="任务名称"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded border border-slate-200 px-2 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:placeholder-slate-400"
              />
              <div className="flex gap-2">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="flex-1 rounded border border-slate-200 px-2 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
                  aria-label="开始日期"
                />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="flex-1 rounded border border-slate-200 px-2 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
                  aria-label="结束日期"
                />
              </div>
              <select
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                className="w-full rounded border border-slate-200 px-2 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
                aria-label="负责人"
              >
                {assignees.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setOpen(false)}
                className="rounded px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                取消
              </button>
              <button
                onClick={handleSubmit}
                className="rounded bg-slate-800 px-3 py-1.5 text-sm text-white hover:bg-slate-700 dark:bg-slate-600 dark:hover:bg-slate-500"
              >
                添加
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function DocLinksEditor({
  links,
  onChange,
}: {
  links: DocLink[];
  onChange: (links: DocLink[]) => void;
}) {
  const addLink = () => {
    onChange([...links, { label: "", url: "" }]);
  };
  const updateLink = (i: number, patch: Partial<DocLink>) => {
    const next = [...links];
    next[i] = { ...next[i], ...patch };
    onChange(next);
  };
  const removeLink = (i: number) => {
    onChange(links.filter((_, j) => j !== i));
  };

  return (
    <div className="mt-3 space-y-2">
      {links.map((link, i) => (
        <div key={i} className="flex gap-2">
          <input
            type="text"
            placeholder="标签（如：初稿、Notion）"
            value={link.label}
            onChange={(e) => updateLink(i, { label: e.target.value })}
            className="w-32 rounded border border-slate-200 px-2 py-1 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:placeholder-slate-400"
          />
          <input
            type="url"
            placeholder="https://..."
            value={link.url}
            onChange={(e) => updateLink(i, { url: e.target.value })}
            className="min-w-0 flex-1 rounded border border-slate-200 px-2 py-1 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:placeholder-slate-400"
          />
          <button
            onClick={() => removeLink(i)}
            className="rounded px-2 text-slate-400 hover:bg-slate-100 hover:text-red-600 dark:hover:bg-slate-700 dark:hover:text-red-300"
          >
            删除
          </button>
        </div>
      ))}
      <button
        onClick={addLink}
        className="rounded border border-dashed border-slate-300 px-3 py-1.5 text-sm text-slate-500 hover:border-slate-400 hover:text-slate-700 dark:border-slate-600 dark:text-slate-400 dark:hover:border-slate-500 dark:hover:text-slate-200"
      >
        + 添加链接
      </button>
    </div>
  );
}
