import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100">404</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">页面不存在</p>
      <Link
        href="/dashboard"
        className="mt-6 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
      >
        返回总览
      </Link>
    </div>
  );
}
