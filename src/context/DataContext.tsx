"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { Paper, Task, Milestone, StoreData } from "@/types";
import {
  loadData,
  saveData,
  getToday,
  computeTaskStatus,
  computePaperProgress,
  isInWeek,
} from "@/lib/store";

interface DataContextValue {
  papers: Paper[];
  tasks: Task[];
  milestones: Milestone[];
  loading: boolean;
  updatePaper: (id: string, patch: Partial<Paper>) => void;
  updateTask: (id: string, patch: Partial<Task>) => void;
  addPaper: (paper: Omit<Paper, "id">) => void;
  deletePaper: (id: string, deleteTasks?: boolean) => void;
  addTask: (task: Omit<Task, "id">) => void;
  deleteTask: (id: string) => void;
  importData: (data: StoreData) => void;
  refresh: () => Promise<void>;
}

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const data = await loadData();
    setPapers(data.papers);
    setTasks(data.tasks);
    setMilestones(data.milestones || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);


  const persist = useCallback((data: StoreData) => {
    saveData(data);
  }, []);

  const updatePaper = useCallback(
    (id: string, patch: Partial<Paper>) => {
      setPapers((prev) => {
        const next = prev.map((p) => (p.id === id ? { ...p, ...patch } : p));
        persist({ papers: next, tasks, milestones });
        return next;
      });
    },
    [tasks, milestones, persist]
  );

  const addPaper = useCallback(
    (paper: Omit<Paper, "id">) => {
      setPapers((prev) => {
        const maxNum = prev.reduce((acc, p) => {
          const m = p.id.match(/^P(\d+)$/);
          return m ? Math.max(acc, parseInt(m[1], 10)) : acc;
        }, 0);
        const id = `P${maxNum + 1}`;
        const newPaper: Paper = { ...paper, id };
        const next = [...prev, newPaper];
        persist({ papers: next, tasks, milestones });
        return next;
      });
    },
    [tasks, milestones, persist]
  );

  const deletePaper = useCallback(
    (id: string, deleteTasks = true) => {
      setPapers((prevPapers) => {
        setTasks((prevTasks) => {
          const nextPapers = prevPapers.filter((p) => p.id !== id);
          const nextTasks = deleteTasks ? prevTasks.filter((t) => t.paperId !== id) : prevTasks;
          persist({ papers: nextPapers, tasks: nextTasks, milestones });
          return nextTasks;
        });
        return prevPapers.filter((p) => p.id !== id);
      });
    },
    [milestones, persist]
  );

  const updateTask = useCallback(
    (id: string, patch: Partial<Task>) => {
      setTasks((prev) => {
        const next = prev.map((t) => (t.id === id ? { ...t, ...patch } : t));
        persist({ papers, tasks: next, milestones });
        return next;
      });
    },
    [papers, milestones, persist]
  );

  const addTask = useCallback(
    (task: Omit<Task, "id">) => {
      const id = `T-${Date.now()}`;
      const newTask: Task = { ...task, id };
      setTasks((prev) => {
        const next = [...prev, newTask];
        persist({ papers, tasks: next, milestones });
        return next;
      });
    },
    [papers, milestones, persist]
  );

  const deleteTask = useCallback(
    (id: string) => {
      setTasks((prev) => {
        const next = prev.filter((t) => t.id !== id);
        persist({ papers, tasks: next, milestones });
        return next;
      });
    },
    [papers, milestones, persist]
  );

  const importData = useCallback(
    (data: StoreData) => {
      setPapers(data.papers);
      setTasks(data.tasks);
      setMilestones(data.milestones || []);
      persist(data);
    },
    [persist]
  );

  return (
    <DataContext.Provider
      value={{
        papers,
        tasks,
        milestones,
        loading,
        updatePaper,
        updateTask,
        addPaper,
        deletePaper,
        addTask,
        deleteTask,
        importData,
        refresh,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}

// 派生数据
export function useDerivedData() {
  const { papers, tasks } = useData();
  const today = getToday();

  const tasksWithStatus = tasks.map((t) => ({
    ...t,
    effectiveStatus: computeTaskStatus(t),
  }));

  const overdueTasks = tasksWithStatus.filter((t) => t.effectiveStatus === "overdue");
  const todayTasks = tasksWithStatus.filter((t) => t.endDate === today && t.effectiveStatus !== "done");
  const weekTasks = tasksWithStatus.filter(
    (t) => isInWeek(t.endDate, new Date()) && t.effectiveStatus !== "done"
  );

  const submittedCount = papers.filter((p) => p.status === "已投稿").length;
  const revisionCount = papers.filter((p) => p.status === "返修").length;
  const acceptedCount = papers.filter((p) => p.status === "接收").length;

  return {
    overdueTasks,
    todayTasks,
    weekTasks,
    tasksWithStatus,
    submittedCount,
    revisionCount,
    acceptedCount,
    today,
  };
}
