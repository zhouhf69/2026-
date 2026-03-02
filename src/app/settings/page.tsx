"use client";

import { useRef, useState, useEffect } from "react";
import { useData } from "@/context/DataContext";
import type { StoreData, Task } from "@/types";
import {
  getReminderPrefs,
  setReminderPrefs,
  getReminderSummary,
  requestNotificationPermission,
  showReminderNotification,
} from "@/lib/reminder";
import { getTheme, setTheme, type Theme } from "@/lib/theme";

const DEFAULT_ASSIGNEES = ["周宏锋", "学术秘书", "数据负责人", "写作支持"];

export default function SettingsPage() {
  const { papers, tasks, importData } = useData();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [storageSize, setStorageSize] = useState(0);

  useEffect(() => {
    const data = localStorage.getItem("paper-board-data");
    setStorageSize((data?.length ?? 0) * 2);
  }, [papers, tasks]);

  const assignees = Array.from(
    new Set(tasks.map((t) => t.assignee).filter(Boolean))
  ).sort();
  const allAssignees = [...new Set([...DEFAULT_ASSIGNEES, ...assignees])];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">设置</h1>

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <h2 className="font-semibold text-slate-800 dark:text-slate-100">数据统计</h2>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-600 dark:bg-slate-700/50">
            <div className="text-2xl font-bold text-slate-800 dark:text-slate-200">{papers.length}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">论文</div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-600 dark:bg-slate-700/50">
            <div className="text-2xl font-bold text-slate-800 dark:text-slate-200">{tasks.length}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">任务</div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-600 dark:bg-slate-700/50">
            <div className="text-2xl font-bold text-slate-800 dark:text-slate-200">
              {tasks.filter((t) => t.status === "done").length}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">已完成</div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-600 dark:bg-slate-700/50">
            <div className="text-2xl font-bold text-slate-800 dark:text-slate-200">
              {storageSize < 1024 ? `${storageSize} B` : `${(storageSize / 1024).toFixed(1)} KB`}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">存储</div>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <h2 className="font-semibold text-slate-800 dark:text-slate-100">负责人工作负载</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          各负责人当前未完成任务数
        </p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {allAssignees.map((a) => {
            const total = tasks.filter((t) => t.assignee === a).length;
            const done = tasks.filter((t) => t.assignee === a && t.status === "done").length;
            const pending = total - done;
            return (
              <div
                key={a}
                className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-600 dark:bg-slate-700/50"
              >
                <div className="font-medium text-slate-800 dark:text-slate-200">{a}</div>
                <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  待办 {pending} · 已完成 {done}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <h2 className="font-semibold text-slate-800 dark:text-slate-100">负责人字典</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          当前任务中使用的负责人（可在甘特图侧边栏或任务中修改）
        </p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {allAssignees.map((a) => (
            <li
              key={a}
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
            >
              {a}
            </li>
          ))}
        </ul>
      </section>

      <ThemeSection />

      <ReminderSection tasks={tasks} />

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <h2 className="font-semibold text-slate-800 dark:text-slate-100">导入 / 导出</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          导入 JSON 将覆盖当前数据，导出可备份
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            className="hidden"
            aria-label="选择 JSON 文件导入"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = () => {
                try {
                  const raw = reader.result as string;
                  const data = JSON.parse(raw) as StoreData;
                  if (!Array.isArray(data.papers)) throw new Error("缺少 papers 数组");
                  if (!Array.isArray(data.tasks)) throw new Error("缺少 tasks 数组");
                  if (confirm("确定导入？将覆盖当前所有数据。")) {
                    importData(data);
                    window.location.reload();
                  }
                } catch (err) {
                  const msg = err instanceof Error ? err.message : "未知错误";
                  alert(`导入失败：${msg}\n\n请确保 JSON 包含 papers 和 tasks 数组。`);
                }
                e.target.value = "";
              };
              reader.readAsText(file);
            }}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
          >
            导入 JSON
          </button>
          <ExportButtons papers={papers} tasks={tasks} />
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <h2 className="font-semibold text-slate-800 dark:text-slate-100">关于</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          2026 八篇论文计划 Web 看板 · Next.js 16 + TypeScript + Tailwind CSS
        </p>
        <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
          数据存储在浏览器 localStorage，支持导入/导出备份
        </p>
        <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
          快捷键：按 <kbd className="rounded border border-slate-300 px-1 dark:border-slate-600">g</kbd> 后按 <kbd className="rounded border border-slate-300 px-1 dark:border-slate-600">d</kbd>/<kbd className="rounded border border-slate-300 px-1 dark:border-slate-600">p</kbd>/<kbd className="rounded border border-slate-300 px-1 dark:border-slate-600">g</kbd>/<kbd className="rounded border border-slate-300 px-1 dark:border-slate-600">t</kbd>/<kbd className="rounded border border-slate-300 px-1 dark:border-slate-600">s</kbd> 快速跳转
        </p>
        <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
          打印：<kbd className="rounded border border-slate-300 px-1 dark:border-slate-600">Ctrl+P</kbd> 打印当前页，导航栏将自动隐藏
        </p>
        <button
          onClick={() => typeof window !== "undefined" && window.print()}
          className="mt-2 rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-400 dark:hover:bg-slate-700"
        >
          打印当前页
        </button>
      </section>
    </div>
  );
}

function ThemeSection() {
  const [theme, setThemeState] = useState<Theme>("system");

  useEffect(() => {
    setThemeState(getTheme());
  }, []);

  const options: { value: Theme; label: string }[] = [
    { value: "light", label: "浅色" },
    { value: "dark", label: "深色" },
    { value: "system", label: "跟随系统" },
  ];

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <h2 className="font-semibold text-slate-800 dark:text-slate-100">主题</h2>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        选择浅色、深色或跟随系统外观
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => {
              setTheme(opt.value);
              setThemeState(opt.value);
            }}
            className={`rounded-lg border px-3 py-1.5 text-sm ${
              theme === opt.value
                ? "border-slate-600 bg-slate-200 text-slate-900 dark:border-slate-400 dark:bg-slate-600 dark:text-slate-100"
                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </section>
  );
}

function ReminderSection({ tasks }: { tasks: Task[] }) {
  const [prefs, setPrefs] = useState({ enabled: false, lastShownDate: null as string | null });
  const [perm, setPerm] = useState<NotificationPermission>("default");
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    setPrefs(getReminderPrefs());
    if (typeof window !== "undefined" && "Notification" in window) {
      setPerm(Notification.permission);
    }
  }, []);

  const toggleEnabled = () => {
    const next = !prefs.enabled;
    setReminderPrefs({ enabled: next });
    setPrefs((p) => ({ ...p, enabled: next }));
  };

  const handleRequestPermission = async () => {
    const result = await requestNotificationPermission();
    setPerm(result);
  };

  const handleTestReminder = async () => {
    setTesting(true);
    if (perm !== "granted") {
      const result = await requestNotificationPermission();
      setPerm(result);
      if (result !== "granted") {
        alert("请允许浏览器通知权限后再试");
        setTesting(false);
        return;
      }
    }
    const summary = getReminderSummary(tasks);
    showReminderNotification(summary);
    setTesting(false);
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <h2 className="font-semibold text-slate-800 dark:text-slate-100">通知</h2>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        每天 09:00 后首次访问时推送「今日到期 + 逾期」（后续可对接站内通知或微信）
      </p>
      <div className="mt-3 space-y-3">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={prefs.enabled}
            onChange={toggleEnabled}
            className="rounded border-slate-300 dark:border-slate-500"
          />
          <span className="text-sm dark:text-slate-200">开启每日提醒</span>
        </label>
        {perm !== "granted" && (
          <button
            onClick={handleRequestPermission}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
          >
            请求通知权限
          </button>
        )}
        <button
          onClick={handleTestReminder}
          disabled={testing}
          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm hover:bg-slate-50 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
        >
          {testing ? "发送中…" : "立即测试提醒"}
        </button>
        {perm === "granted" && (
          <p className="text-xs text-green-600">✓ 通知权限已开启</p>
        )}
      </div>
    </section>
  );
}

function ExportButtons({
  papers,
  tasks,
}: {
  papers: { id: string; title: string; track: string; plannedSubmitDate: string; status: string }[];
  tasks: { id: string; paperId: string; name: string; startDate: string; endDate: string; status: string; assignee: string }[];
}) {
  const exportJSON = () => {
    const data = { papers, tasks, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `paper-board-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const escape = (s: string) => (s.includes(",") ? `"${s.replace(/"/g, '""')}"` : s);
  const exportCSV = () => {
    const headers = ["论文ID", "论文标题", "任务ID", "任务名", "开始", "结束", "状态", "负责人"];
    const rows = tasks.map((t) => {
      const p = papers.find((x) => x.id === t.paperId);
      return [
        escape(t.paperId),
        escape(p?.title ?? ""),
        escape(t.id),
        escape(t.name),
        t.startDate,
        t.endDate,
        escape(t.status),
        escape(t.assignee),
      ].join(",");
    });
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `paper-board-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mt-3 flex gap-2">
      <button
        onClick={exportJSON}
        className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
      >
        导出 JSON
      </button>
      <button
        onClick={exportCSV}
        className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
      >
        导出 CSV
      </button>
    </div>
  );
}
