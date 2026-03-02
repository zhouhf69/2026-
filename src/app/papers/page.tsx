"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useData } from "@/context/DataContext";
import { computePaperProgress, getRiskSignal, daysUntil, isHighRisk } from "@/lib/store";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { Track, Paper, PaperStatus } from "@/types";

const TRACKS: Track[] = ["AI治理", "NETs", "DIP", "专科RWE", "筛查"];
const STATUSES: PaperStatus[] = ["规划", "写作", "内审", "已投稿", "返修", "接收", "拒稿"];

export default function PapersPage() {
  return (
    <Suspense fallback={<PapersLoading />}>
      <PapersContent />
    </Suspense>
  );
}

function PapersLoading() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-32 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
      <div className="h-14 animate-pulse rounded-xl border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-36 animate-pulse rounded-xl border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800" />
        ))}
      </div>
    </div>
  );
}

function PapersContent() {
  const { papers, tasks, loading, addPaper, updatePaper } = useData();
  const searchParams = useSearchParams();
  const riskFilter = searchParams.get("risk") === "high";
  const [filterTrack, setFilterTrack] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "progress" | "title">("date");
  const [addModalOpen, setAddModalOpen] = useState(false);

  const filtered = useMemo(() => {
    return papers.filter((p) => {
      if (riskFilter && !isHighRisk(p, tasks)) return false;
      if (filterTrack !== "all" && p.track !== filterTrack) return false;
      if (filterStatus !== "all" && p.status !== filterStatus) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          p.title.toLowerCase().includes(q) ||
          p.id.toLowerCase().includes(q) ||
          p.track.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [papers, filterTrack, filterStatus, search, riskFilter, tasks]);

  const trackCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of papers) {
      counts[p.track] = (counts[p.track] ?? 0) + 1;
    }
    return counts;
  }, [papers]);

  const sortedPapers = useMemo(() => {
    const list = [...filtered];
    if (sortBy === "date") {
      list.sort((a, b) => a.plannedSubmitDate.localeCompare(b.plannedSubmitDate));
    } else if (sortBy === "progress") {
      list.sort((a, b) => {
        const pa = computePaperProgress(a.id, tasks);
        const pb = computePaperProgress(b.id, tasks);
        return pb - pa;
      });
    } else {
      list.sort((a, b) => a.title.localeCompare(b.title));
    }
    return list;
  }, [filtered, sortBy, tasks]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-32 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
        <div className="h-14 animate-pulse rounded-xl border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-36 animate-pulse rounded-xl border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">论文列表</h1>
        <button
          onClick={() => setAddModalOpen(true)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
        >
          + 新增论文
        </button>
      </div>

      {/* 筛选 */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-800">
        {riskFilter && (
          <div className="flex items-center gap-2 rounded border border-red-200 bg-red-50 px-2 py-1 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-200">
            <span>仅显示高风险论文</span>
            <Link
              href="/papers"
              className="font-medium hover:underline"
            >
              清除
            </Link>
          </div>
        )}
        <span className="text-sm text-slate-500 dark:text-slate-400">
          共 {filtered.length} 篇
          {filterTrack === "all" && Object.keys(trackCounts).length > 0 && (
            <span className="ml-1 text-slate-400 dark:text-slate-500">
              （{TRACKS.filter((t) => trackCounts[t]).map((t) => `${t} ${trackCounts[t]}`).join(" · ")}）
            </span>
          )}
        </span>
        <input
          type="text"
          placeholder="搜索论文标题、ID、赛道..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded border border-slate-200 px-3 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:placeholder-slate-400"
        />
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500 dark:text-slate-400">赛道：</span>
          <select
            value={filterTrack}
            onChange={(e) => setFilterTrack(e.target.value)}
            className="rounded border border-slate-200 px-2 py-1 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
            aria-label="筛选赛道"
          >
            <option value="all">全部</option>
            {TRACKS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500 dark:text-slate-400">状态：</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded border border-slate-200 px-2 py-1 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
            aria-label="筛选状态"
          >
            <option value="all">全部</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500 dark:text-slate-400">排序：</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "date" | "progress" | "title")}
            className="rounded border border-slate-200 px-2 py-1 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
            aria-label="排序方式"
          >
            <option value="date">投稿日期</option>
            <option value="progress">进度</option>
            <option value="title">标题</option>
          </select>
        </div>
        {(filterTrack !== "all" || filterStatus !== "all" || search.trim()) && (
          <button
            onClick={() => {
              setFilterTrack("all");
              setFilterStatus("all");
              setSearch("");
            }}
            className="rounded border border-slate-200 px-2 py-1 text-sm text-slate-500 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-400 dark:hover:bg-slate-700"
          >
            清空筛选
          </button>
        )}
      </div>

      {/* 论文卡片 */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {sortedPapers.map((p) => {
          const progress = computePaperProgress(p.id, tasks);
          const signal = getRiskSignal(p, tasks);
          const days = daysUntil(p.plannedSubmitDate);
          const riskConfig = {
            red: { border: "border-red-300 dark:border-red-700", bg: "bg-red-50/30 dark:bg-red-900/20", badge: "bg-red-100 text-red-700 dark:bg-red-800/50 dark:text-red-200", label: "红灯" },
            yellow: { border: "border-amber-300 dark:border-amber-700", bg: "bg-amber-50/30 dark:bg-amber-900/20", badge: "bg-amber-100 text-amber-700 dark:bg-amber-800/50 dark:text-amber-200", label: "黄灯" },
            orange: { border: "border-orange-300 dark:border-orange-700", bg: "bg-orange-50/30 dark:bg-orange-900/20", badge: "bg-orange-100 text-orange-700 dark:bg-orange-800/50 dark:text-orange-200", label: "橙灯" },
            green: { border: "border-slate-200 dark:border-slate-600", bg: "", badge: "", label: "" },
          }[signal];
          return (
            <div
              key={p.id}
              className={`relative rounded-xl border p-4 transition hover:shadow-md dark:bg-slate-800/50 ${
                signal !== "green" ? `${riskConfig.border} ${riskConfig.bg}` : "border-slate-200 bg-white dark:border-slate-600 dark:bg-slate-800"
              }`}
            >
              <div
                className="absolute right-3 top-3 z-10"
                onClick={(e) => e.stopPropagation()}
              >
                <select
                  value={p.status}
                  onChange={(e) => updatePaper(p.id, { status: e.target.value as Paper["status"] })}
                  className="rounded border border-slate-200 bg-white px-1.5 py-0.5 text-xs dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
                  aria-label="论文状态"
                  title="快速修改状态"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <Link href={`/papers/${p.id}`} className="block pr-20">
                <div className="flex items-start justify-between">
                  <span className="rounded bg-slate-200 px-1.5 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-600 dark:text-slate-300">
                    {p.id}
                  </span>
                  {signal !== "green" && (
                    <span className={`rounded px-1.5 py-0.5 text-xs ${riskConfig.badge}`}>
                      {riskConfig.label}
                    </span>
                  )}
                </div>
                <h3 className="mt-2 font-semibold text-slate-800 dark:text-slate-200">{p.title}</h3>
                <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{p.track} · {p.status}</div>
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
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/50 py-12 text-center dark:border-slate-600 dark:bg-slate-800/30">
          {papers.length === 0 ? (
            <>
              <p className="text-slate-600 dark:text-slate-400">暂无论文，点击上方「新增论文」开始添加</p>
              <button
                onClick={() => setAddModalOpen(true)}
                className="mt-3 rounded-lg bg-slate-800 px-4 py-2 text-sm text-white hover:bg-slate-700 dark:bg-slate-600 dark:hover:bg-slate-500"
              >
                + 新增论文
              </button>
            </>
          ) : (
            <p className="text-slate-500 dark:text-slate-400">暂无匹配论文，可调整搜索或筛选条件</p>
          )}
        </div>
      )}

      {addModalOpen && (
        <AddPaperModal
          onClose={() => setAddModalOpen(false)}
          onSave={(paper) => {
            addPaper(paper);
            setAddModalOpen(false);
          }}
          tracks={TRACKS}
          statuses={STATUSES}
        />
      )}
    </div>
  );
}

function AddPaperModal({
  onClose,
  onSave,
  tracks,
  statuses,
}: {
  onClose: () => void;
  onSave: (paper: Omit<Paper, "id">) => void;
  tracks: Track[];
  statuses: PaperStatus[];
}) {
  const today = new Date().toISOString().slice(0, 10);
  const [title, setTitle] = useState("");
  const [track, setTrack] = useState<Track>(tracks[0]);
  const [status, setStatus] = useState<PaperStatus>("规划");
  const [plannedSubmitDate, setPlannedSubmitDate] = useState(today);
  const [stretch, setStretch] = useState("");
  const [main, setMain] = useState("");
  const [fallback, setFallback] = useState("");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleSubmit = () => {
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
        className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-4 shadow-xl dark:border-slate-700 dark:bg-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-semibold text-slate-800 dark:text-slate-100">新增论文</h3>
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
              onChange={(e) => setStatus(e.target.value as PaperStatus)}
              className="flex-1 rounded border border-slate-200 px-2 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
              aria-label="状态"
            >
              {statuses.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
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
            onClick={handleSubmit}
            disabled={!title.trim()}
            className="rounded bg-slate-800 px-3 py-1.5 text-sm text-white hover:bg-slate-700 disabled:opacity-50 dark:bg-slate-600 dark:hover:bg-slate-500"
          >
            添加
          </button>
        </div>
      </div>
    </div>
  );
}
