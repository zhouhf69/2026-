"use client";

import { useMemo, useState, useRef, useCallback, useEffect } from "react";
import type { Task } from "@/types";
import type { Paper } from "@/types";

type ViewMode = "Day" | "Week" | "Month" | "Quarter";

interface GanttChartProps {
  tasks: Task[];
  papers: Paper[];
  onTaskClick: (task: Task) => void;
  onDateChange?: (taskId: string, startDate: string, endDate: string) => void;
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr + "T00:00:00");
  d.setDate(d.getDate() + Math.round(days));
  return d.toISOString().slice(0, 10);
}

const TRACK_HEIGHT = 36;
const HEADER_HEIGHT = 44;

function parseDate(s: string): Date {
  return new Date(s + "T00:00:00");
}

function formatDate(d: Date, mode: ViewMode): string {
  if (mode === "Day") return `${d.getMonth() + 1}/${d.getDate()}`;
  if (mode === "Week") return `W${getWeekNumber(d)}`;
  if (mode === "Quarter") return `${d.getFullYear()}-Q${Math.floor(d.getMonth() / 3) + 1}`;
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function getWeekNumber(d: Date): number {
  const first = new Date(d.getFullYear(), 0, 1);
  const past = (d.getTime() - first.getTime()) / 86400000;
  return Math.ceil((past + first.getDay() + 1) / 7);
}

export default function GanttChart({
  tasks,
  papers,
  onTaskClick,
  onDateChange,
}: GanttChartProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("Week");
  const didDragRef = useRef(false);
  const [drag, setDrag] = useState<{
    taskId: string;
    startX: number;
    origStart: string;
    origEnd: string;
  } | null>(null);

  const { minDate, maxDate, days } = useMemo(() => {
    const dates = tasks.flatMap((t) => [t.startDate, t.endDate]);
    const min = dates.reduce((a, b) => (a < b ? a : b), "2026-01-01");
    const max = dates.reduce((a, b) => (a > b ? a : b), "2026-12-31");
    const start = parseDate(min);
    const end = parseDate(max);
    const dayCount = Math.ceil((end.getTime() - start.getTime()) / 86400000) + 1;

    const d: { date: Date; label: string }[] = [];
    const curr = new Date(start);
    if (viewMode === "Quarter") {
      curr.setMonth(Math.floor(curr.getMonth() / 3) * 3);
      curr.setDate(1);
    }
    while (curr <= end) {
      d.push({ date: new Date(curr), label: formatDate(curr, viewMode) });
      if (viewMode === "Day") curr.setDate(curr.getDate() + 1);
      else if (viewMode === "Week") curr.setDate(curr.getDate() + 7);
      else if (viewMode === "Quarter") curr.setMonth(curr.getMonth() + 3);
      else curr.setMonth(curr.getMonth() + 1);
    }

    return {
      minDate: min,
      maxDate: max,
      days: d,
      start,
      daysTotal: dayCount,
    };
  }, [tasks, viewMode]);

  const start = parseDate(minDate);
  const end = parseDate(maxDate);
  const totalMs = end.getTime() - start.getTime();
  const totalDays = Math.max(1, totalMs / 86400000);
  const chartWidth = Math.max(600, days.length * 32);
  const colWidth = chartWidth / days.length;

  const getLeft = (dateStr: string) => {
    const d = parseDate(dateStr);
    const daysFromStart = Math.max(0, (d.getTime() - start.getTime()) / 86400000);
    return (daysFromStart / totalDays) * chartWidth;
  };

  const getWidth = (startStr: string, endStr: string) => {
    const s = parseDate(startStr);
    const e = parseDate(endStr);
    const daysSpan = (e.getTime() - s.getTime()) / 86400000 + 1;
    return Math.max(24, (daysSpan / totalDays) * chartWidth);
  };

  const pixelsToDays = chartWidth / totalDays;

  const handleBarMouseDown = useCallback(
    (e: React.MouseEvent, task: Task) => {
      e.stopPropagation();
      didDragRef.current = false;
      if (!onDateChange) return;
      setDrag({
        taskId: task.id,
        startX: e.clientX,
        origStart: task.startDate,
        origEnd: task.endDate,
      });
    },
    [onDateChange]
  );

  useEffect(() => {
    if (!drag || !onDateChange) return;
    const onUp = (e: MouseEvent) => {
      const deltaPx = e.clientX - drag.startX;
      if (Math.abs(deltaPx) > 5) didDragRef.current = true;
      const deltaDays = deltaPx / pixelsToDays;
      const origSpan =
        (new Date(drag.origEnd + "T00:00:00").getTime() -
          new Date(drag.origStart + "T00:00:00").getTime()) /
        86400000;
      const newStart = addDays(drag.origStart, deltaDays);
      const newEnd = addDays(drag.origStart, origSpan + deltaDays);
      onDateChange(drag.taskId, newStart, newEnd);
      setDrag(null);
    };
    window.addEventListener("mouseup", onUp);
    return () => window.removeEventListener("mouseup", onUp);
  }, [drag, onDateChange, pixelsToDays]);

  const getStatusColor = (t: Task) => {
    const effective =
      t.status === "done" ? "done" : t.endDate < new Date().toISOString().slice(0, 10) ? "overdue" : t.status;
    switch (effective) {
      case "done":
        return "bg-green-500";
      case "overdue":
        return "bg-red-500";
      case "doing":
        return "bg-blue-500";
      case "blocked":
        return "bg-amber-500";
      default:
        return "bg-slate-400";
    }
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-center gap-2 border-b border-slate-200 p-2 dark:border-slate-600">
        {(["Day", "Week", "Month", "Quarter"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setViewMode(m)}
            className={`rounded px-3 py-1.5 text-sm font-medium ${
              viewMode === m
                ? "bg-slate-800 text-white dark:bg-slate-600"
                : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
            }`}
          >
            {m}
          </button>
        ))}
      </div>
      <div className="flex" style={{ minWidth: chartWidth + 200 }}>
        {/* 左侧任务名 */}
        <div className="sticky left-0 z-10 w-48 shrink-0 border-r border-slate-200 bg-slate-50 dark:border-slate-600 dark:bg-slate-800">
          <div
            className="flex items-center border-b border-slate-200 px-2 font-medium text-slate-600 dark:border-slate-600 dark:text-slate-300"
            style={{ height: HEADER_HEIGHT }}
          >
            任务
          </div>
          {tasks.map((t) => (
            <div
              key={t.id}
              onClick={() => onTaskClick(t)}
              className="flex cursor-pointer items-center gap-1 border-b border-slate-100 px-2 py-1 text-sm hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-700"
              style={{ height: TRACK_HEIGHT }}
            >
              <span className="shrink-0 rounded bg-slate-200 px-1 text-xs text-slate-500 dark:bg-slate-600 dark:text-slate-300">
                {t.paperId}
              </span>
              <span className="truncate dark:text-slate-200">{t.name}</span>
            </div>
          ))}
        </div>
        {/* 甘特条 */}
        <div className="relative min-w-0 flex-1">
          <div
            className="flex border-b border-slate-200 bg-slate-50 dark:border-slate-600 dark:bg-slate-800"
            style={{ height: HEADER_HEIGHT }}
          >
            {days.map((d) => (
              <div
                key={d.label}
                className="shrink-0 border-r border-slate-200 px-1 text-center text-xs text-slate-500 dark:border-slate-600 dark:text-slate-400"
                style={{ width: colWidth }}
              >
                {d.label}
              </div>
            ))}
          </div>
          {tasks.map((t) => (
            <div
              key={t.id}
              className="relative flex border-b border-slate-100 dark:border-slate-700"
              style={{ height: TRACK_HEIGHT }}
            >
              <div
                className={`absolute top-1/2 -translate-y-1/2 rounded py-1 ${getStatusColor(
                  t
                )} text-white transition hover:opacity-90 ${
                  onDateChange ? "cursor-grab active:cursor-grabbing" : "cursor-pointer"
                }`}
                style={{
                  left: getLeft(t.startDate),
                  width: getWidth(t.startDate, t.endDate),
                  minWidth: 20,
                }}
                onClick={() => !didDragRef.current && onTaskClick(t)}
                onMouseDown={(e) => onDateChange && handleBarMouseDown(e, t)}
              >
                <span className="ml-1 truncate text-xs">{t.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
