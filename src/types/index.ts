// 论文赛道
export type Track =
  | "AI治理"
  | "NETs"
  | "DIP"
  | "专科RWE"
  | "筛查";

// 论文状态
export type PaperStatus =
  | "规划"
  | "写作"
  | "内审"
  | "已投稿"
  | "返修"
  | "接收"
  | "拒稿";

// 任务状态
export type TaskStatus = "todo" | "doing" | "blocked" | "done" | "overdue";

// 风险等级
export type RiskLevel = "low" | "med" | "high";

// 目标期刊层级
export interface TargetJournals {
  stretch?: string; // 冲刺
  main?: string; // 主投
  fallback?: string; // 保底
}

// 文档链接
export interface DocLink {
  label: string;
  url: string;
}

// 论文
export interface Paper {
  id: string;
  title: string;
  track: Track;
  targetJournals: TargetJournals;
  plannedSubmitDate: string; // YYYY-MM-DD
  status: PaperStatus;
  progress?: number; // 自动计算
  docLinks?: DocLink[];
}

// 任务
export interface Task {
  id: string;
  paperId: string;
  name: string;
  startDate: string;
  endDate: string;
  status: TaskStatus;
  assignee: string;
  dependsOn: string[];
  deliverable?: string;
  checklist: { text: string; done: boolean }[];
  riskLevel: RiskLevel;
  notes?: string;
}

// 里程碑（可选）
export interface Milestone {
  id: string;
  paperId: string;
  name: string;
  date: string;
}

// 存储结构
export interface StoreData {
  papers: Paper[];
  tasks: Task[];
  milestones: Milestone[];
}
