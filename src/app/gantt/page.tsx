"use client";

import { useState, useMemo, useEffect } from "react";
import { useData } from "@/context/DataContext";
import GanttChart from "@/components/GanttChart";
import type { Task, Paper } from "@/types";

export default function GanttPage() {
  const { tasks, papers, updateTask, loading } = useData();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [filterPaper, setFilterPaper] = useState<string>("all");
  const [filterTrack, setFilterTrack] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterAssignee, setFilterAssignee] = useState<string>("all");

  const assignees = useMemo(() => {
    const set = new Set(tasks.map((t) => t.assignee));
    return Array.from(set).sort();
  }, [tasks]);

  const tracks = useMemo(() => {
    const set = new Set(papers.map((p) => p.track));
    return Array.from(set).sort();
  }, [papers]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const paper = papers.find((p) => p.id === t.paperId);
      if (filterPaper !== "all" && t.paperId !== filterPaper) return false;
      if (filterTrack !== "all" && paper?.track !== filterTrack) return false;
      if (filterStatus !== "all") {
        const effective = t.endDate < new Date().toISOString().slice(0, 10) && t.status !== "done"
          ? "overdue"
          : t.status;
        if (effective !== filterStatus) return false;
      }
      if (filterAssignee !== "all" && t.assignee !== filterAssignee) return false;
      return true;
    });
  }, [tasks, papers, filterPaper, filterTrack, filterStatus, filterAssignee]);


  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
        <div className="h-14 animate-pulse rounded-xl border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800" />
        <div className="h-80 animate-pulse rounded-xl border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">甘特图</h1>

      {/* 过滤器 */}
      <div className="flex flex-wrap gap-3 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-800">
        <FilterSelect
          label="论文"
          value={filterPaper}
          onChange={setFilterPaper}
          options={[
            { value: "all", label: "全部" },
            ...papers.map((p) => ({ value: p.id, label: `${p.id} ${p.title}` })),
          ]}
        />
        <FilterSelect
          label="赛道"
          value={filterTrack}
          onChange={setFilterTrack}
          options={[
            { value: "all", label: "全部" },
            ...tracks.map((t) => ({ value: t, label: t })),
          ]}
        />
        <FilterSelect
          label="状态"
          value={filterStatus}
          onChange={setFilterStatus}
          options={[
            { value: "all", label: "全部" },
            { value: "todo", label: "未开始" },
            { value: "doing", label: "进行中" },
            { value: "blocked", label: "阻塞" },
            { value: "done", label: "完成" },
            { value: "overdue", label: "逾期" },
          ]}
        />
        <FilterSelect
          label="负责人"
          value={filterAssignee}
          onChange={setFilterAssignee}
          options={[
            { value: "all", label: "全部" },
            ...assignees.map((a) => ({ value: a, label: a })),
          ]}
        />
        {(filterPaper !== "all" || filterTrack !== "all" || filterStatus !== "all" || filterAssignee !== "all") && (
          <button
            onClick={() => {
              setFilterPaper("all");
              setFilterTrack("all");
              setFilterStatus("all");
              setFilterAssignee("all");
            }}
            className="rounded border border-slate-200 px-2 py-1 text-sm text-slate-500 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-400 dark:hover:bg-slate-700"
          >
            清空筛选
          </button>
        )}
      </div>

      <div className="flex gap-4">
        <div className="min-w-0 flex-1">
          <GanttChart
            tasks={filteredTasks}
            papers={papers}
            onTaskClick={setSelectedTask}
            onDateChange={(taskId, startDate, endDate) =>
              updateTask(taskId, { startDate, endDate })
            }
          />
        </div>

        {/* 侧边栏 */}
        {selectedTask && (
          <TaskSidebar
            task={selectedTask}
            paper={papers.find((p) => p.id === selectedTask.paperId)!}
            onClose={() => setSelectedTask(null)}
            onUpdate={(patch) => {
              updateTask(selectedTask.id, patch);
              setSelectedTask({ ...selectedTask, ...patch });
            }}
          />
        )}
      </div>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-slate-600 dark:text-slate-400">{label}:</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded border border-slate-200 bg-white px-2 py-1 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function TaskSidebar({
  task,
  paper,
  onClose,
  onUpdate,
}: {
  task: Task;
  paper: Paper;
  onClose: () => void;
  onUpdate: (patch: Partial<Task>) => void;
}) {
  const [notes, setNotes] = useState(task.notes ?? "");
  useEffect(() => {
    setNotes(task.notes ?? "");
  }, [task.notes]);

  return (
    <div className="w-80 shrink-0 rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-center justify-between border-b border-slate-200 p-3 dark:border-slate-600">
        <h3 className="font-semibold text-slate-800 dark:text-slate-100">{task.name}</h3>
        <button
          onClick={onClose}
          className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-300"
        >
          ✕
        </button>
      </div>
      <div className="space-y-3 p-3 text-sm">
        <div>
          <span className="text-slate-500 dark:text-slate-400">论文：</span>
          <span className="font-medium dark:text-slate-200">{paper.title}</span>
        </div>
        <div>
          <span className="text-slate-500 dark:text-slate-400">日期：</span>
          <span>{task.startDate} ~ {task.endDate}</span>
        </div>
        <div>
          <span className="text-slate-500 dark:text-slate-400">负责人：</span>
          <select
            value={task.assignee}
            onChange={(e) => onUpdate({ assignee: e.target.value })}
            className="rounded border border-slate-200 px-2 py-0.5 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
          >
            <option>周宏锋</option>
            <option>学术秘书</option>
            <option>数据负责人</option>
            <option>写作支持</option>
          </select>
        </div>
        <div>
          <span className="text-slate-500 dark:text-slate-400">状态：</span>
          <select
            value={task.status}
            onChange={(e) => onUpdate({ status: e.target.value as Task["status"] })}
            className="rounded border border-slate-200 px-2 py-0.5 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
          >
            <option value="todo">未开始</option>
            <option value="doing">进行中</option>
            <option value="blocked">阻塞</option>
            <option value="done">完成</option>
          </select>
        </div>
        {task.deliverable && (
          <div>
            <span className="text-slate-500 dark:text-slate-400">交付物：</span>
            <span className="dark:text-slate-200">{task.deliverable}</span>
          </div>
        )}
        <div>
          <span className="text-slate-500 dark:text-slate-400">备注：</span>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            onBlur={() => onUpdate({ notes })}
            className="mt-1 w-full rounded border border-slate-200 p-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
            rows={3}
          />
        </div>
        {task.checklist && task.checklist.length > 0 && (
          <div>
            <span className="text-slate-500 dark:text-slate-400">Checklist：</span>
            <ul className="mt-1 space-y-1">
              {task.checklist.map((c, i) => (
                <li key={i} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={c.done}
                    className="rounded border-slate-300 dark:border-slate-500"
                    onChange={() => {
                      const next = [...task.checklist];
                      next[i] = { ...next[i], done: !next[i].done };
                      onUpdate({ checklist: next });
                    }}
                  />
                  <span className={c.done ? "line-through text-slate-500 dark:text-slate-400" : "dark:text-slate-200"}>{c.text}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
