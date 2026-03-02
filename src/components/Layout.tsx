"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useData, useDerivedData } from "@/context/DataContext";
import { getTheme, setTheme, type Theme } from "@/lib/theme";

const nav = [
  { href: "/dashboard", label: "总览" },
  { href: "/papers", label: "论文" },
  { href: "/gantt", label: "甘特图" },
  { href: "/tasks", label: "任务中心" },
  { href: "/settings", label: "设置" },
];

const SHORTCUTS: Record<string, string> = {
  d: "/dashboard",
  p: "/papers",
  g: "/gantt",
  t: "/tasks",
  s: "/settings",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const { refresh } = useData();
  const { overdueTasks, todayTasks } = useDerivedData();
  const pathname = usePathname();
  const router = useRouter();
  const gPressed = useRef(false);
  const taskBadge = overdueTasks.length > 0 ? overdueTasks.length : todayTasks.length;

  useEffect(() => {
    let resetTimer: ReturnType<typeof setTimeout>;
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "g" && !e.ctrlKey && !e.metaKey && !e.altKey) {
        gPressed.current = true;
        clearTimeout(resetTimer);
        resetTimer = setTimeout(() => { gPressed.current = false; }, 800);
        return;
      }
      if (gPressed.current && e.key in SHORTCUTS) {
        e.preventDefault();
        router.push(SHORTCUTS[e.key]);
        gPressed.current = false;
      } else {
        gPressed.current = false;
      }
    };
    window.addEventListener("keydown", handler);
    return () => {
      window.removeEventListener("keydown", handler);
      clearTimeout(resetTimer);
    };
  }, [router]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setThemeState] = useState<Theme>("system");

  useEffect(() => {
    setThemeState(getTheme());
    const handler = () => setThemeState(getTheme());
    window.addEventListener("theme-changed", handler);
    return () => window.removeEventListener("theme-changed", handler);
  }, []);

  const cycleTheme = () => {
    const next: Theme = theme === "light" ? "dark" : theme === "dark" ? "system" : "light";
    setTheme(next);
    setThemeState(next);
  };

  const handleReset = () => {
    if (typeof window !== "undefined" && confirm("确定重置为初始种子数据？当前修改将丢失。")) {
      localStorage.removeItem("paper-board-data");
      refresh().then(() => window.location.reload());
    }
  };

  const closeMobile = () => setMobileOpen(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-700 dark:bg-slate-900/95 print:hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link href="/dashboard" className="text-lg font-semibold text-slate-800 dark:text-slate-100">
            2026 八篇论文计划
          </Link>
          {/* 桌面端导航 */}
          <nav className="hidden items-center gap-6 md:flex">
            {nav.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`text-sm font-medium ${
                  pathname === href || pathname.startsWith(href + "/")
                    ? "text-slate-900 dark:text-slate-100"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                }`}
              >
                <span className="inline-flex items-center gap-1.5">
                  {label}
                  {href === "/tasks" && taskBadge > 0 && (
                    <span
                      className={`flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-medium ${
                        overdueTasks.length > 0
                          ? "bg-red-500 text-white"
                          : "bg-amber-500 text-white"
                      }`}
                    >
                      {taskBadge}
                    </span>
                  )}
                </span>
              </Link>
            ))}
            <button
              onClick={cycleTheme}
              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              title={`主题: ${theme === "light" ? "浅色" : theme === "dark" ? "深色" : "跟随系统"}`}
              aria-label="切换主题"
            >
              <ThemeIcon theme={theme} />
            </button>
            <button
              onClick={handleReset}
              className="text-xs text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
              title="重置为 seed.json 初始数据"
            >
              重置数据
            </button>
          </nav>
          {/* 移动端：主题 + 汉堡 */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={cycleTheme}
              className="rounded-lg p-1.5 text-slate-500 dark:text-slate-400"
              aria-label="切换主题"
            >
              <ThemeIcon theme={theme} />
            </button>
            <button
              onClick={() => setMobileOpen((o) => !o)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-600 md:hidden"
              aria-label="打开菜单"
            >
            <svg
              className="h-5 w-5 text-slate-600 dark:text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
          </div>
        </div>
        {/* 移动端折叠菜单 */}
        {mobileOpen && (
          <>
            <div
              className="fixed inset-0 z-[5] bg-black/20 md:hidden"
              onClick={closeMobile}
              aria-hidden
            />
            <div className="relative z-[10] border-t border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900 md:hidden">
            <nav className="flex flex-col gap-1">
              {nav.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={closeMobile}
                  className={`rounded-lg px-3 py-2 text-sm font-medium ${
                    pathname === href || pathname.startsWith(href + "/")
                      ? "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100"
                      : "text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800"
                  }`}
                >
                  {label}
                  {href === "/tasks" && taskBadge > 0 && (
                    <span
                      className={`ml-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-medium ${
                        overdueTasks.length > 0
                          ? "bg-red-500 text-white"
                          : "bg-amber-500 text-white"
                      }`}
                    >
                      {taskBadge}
                    </span>
                  )}
                </Link>
              ))}
              <button
                onClick={() => {
                  handleReset();
                  closeMobile();
                }}
                className="rounded-lg px-3 py-2 text-left text-xs text-slate-400 hover:bg-slate-50 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
              >
                重置数据
              </button>
            </nav>
            </div>
          </>
        )}
      </header>
      <main className="mx-auto max-w-7xl px-4 py-4 sm:py-6">{children}</main>
    </div>
  );
}

function ThemeIcon({ theme }: { theme: Theme }) {
  if (theme === "dark") {
    return (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      </svg>
    );
  }
  if (theme === "light") {
    return (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    );
  }
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}
