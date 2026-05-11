import type {
  CaseItem,
  DashboardMetrics,
  PreparationItem,
  ProjectItem,
  RoleScopeItem,
  SystemConfig,
  TransformationItem,
} from "@/types";

export const mockMetrics: DashboardMetrics = {
  current_projects: 12,
  hospital_preparations: 38,
  enrolled_cases: 286,
  wound_images: 1248,
  followup_completion_rate: 82,
  ai_analysis_tasks: 936,
  adverse_events: 6,
  generated_reports: 18,
};

export const mockPreparations: PreparationItem[] = [
  { id: "1", prep_id: "PREP-001", name: "复方黄柏液外用制剂", prep_type: "外用药", dosage_form: "洗剂", evidence_level: "III级" },
  { id: "2", prep_id: "PREP-002", name: "生肌玉红膏", prep_type: "经典名方", dosage_form: "膏剂", evidence_level: "III级" },
  { id: "3", prep_id: "PREP-003", name: "肛周熏洗方", prep_type: "经验方", dosage_form: "熏洗剂", evidence_level: "IV级" },
  { id: "4", prep_id: "PREP-004", name: "造口护肤膏", prep_type: "外用药", dosage_form: "膏剂", evidence_level: "III级" },
  { id: "5", prep_id: "PREP-005", name: "肠瘘创面湿敷方", prep_type: "经典名方", dosage_form: "湿敷剂", evidence_level: "III级" },
  { id: "6", prep_id: "PREP-006", name: "慢性创面生肌散", prep_type: "经验方", dosage_form: "散剂", evidence_level: "IV级" },
  { id: "7", prep_id: "PREP-007", name: "糖足清创外洗方", prep_type: "外用药", dosage_form: "洗剂", evidence_level: "III级" },
  { id: "8", prep_id: "PREP-008", name: "术后切口修复膏", prep_type: "外用药", dosage_form: "膏剂", evidence_level: "III级" },
];

export const mockProjects: ProjectItem[] = [
  {
    id: "p1",
    project_name: "肠瘘创面外用制剂真实世界疗效观察",
    project_code: "RWS-2026-001",
    research_type: "单臂真实世界研究",
    project_status: "入组中",
    sample_target: 120,
    current_enrollment: 68,
  },
  {
    id: "p2",
    project_name: "生肌玉红膏促进慢性创面愈合的真实世界研究",
    project_code: "RWS-2026-002",
    research_type: "前瞻性队列研究",
    project_status: "随访中",
    sample_target: 100,
    current_enrollment: 51,
  },
];

export const mockCases: CaseItem[] = [
  {
    id: "c1",
    case_code: "CASE-001",
    deidentified_id: "PID-A9F2M3",
    age: 56,
    gender: "男",
    primary_diagnosis: "肛瘘术后创面",
    enrollment_status: "已入组",
    followup_status: "D14待随访",
  },
  {
    id: "c2",
    case_code: "CASE-002",
    deidentified_id: "PID-Z8Q4N2",
    age: 63,
    gender: "女",
    primary_diagnosis: "糖尿病足慢性创面",
    enrollment_status: "已入组",
    followup_status: "随访中",
  },
];

export const mockTransformationProjects: TransformationItem[] = [
  {
    id: "tp-1",
    transformation_name: "生肌玉红膏慢性创面转化项目",
    evidence_level: "III级",
    market_potential: "高",
    phase: "真实世界研究",
    milestones: "Q2完成证据包初稿，Q3启动多中心合作",
  },
  {
    id: "tp-2",
    transformation_name: "复方黄柏液外用制剂循证推广项目",
    evidence_level: "III级",
    market_potential: "中高",
    phase: "专家共识",
    milestones: "已完成病例系列整理，准备专家论证会",
  },
];

export const mockRoleScopes: RoleScopeItem[] = [
  {
    id: "r1",
    code: "PI",
    name: "项目负责人",
    menu_scope: ["dashboard", "projects", "cases", "wounds", "followups", "sops", "ai", "stats"],
    page_scope: ["项目详情", "病例详情", "统计中心"],
    button_scope: ["create", "update", "review"],
    export_permission: true,
    review_permission: true,
  },
  {
    id: "r2",
    code: "Doctor",
    name: "临床医生",
    menu_scope: ["dashboard", "cases", "wounds", "followups", "ai"],
    page_scope: ["病例详情", "创面分析详情"],
    button_scope: ["update", "review"],
    export_permission: false,
    review_permission: true,
  },
];

export const mockSystemConfig: SystemConfig = {
  departments: ["创面修复中心", "肛肠科", "皮肤科", "药学部"],
  score_scales: ["疼痛NRS", "红肿评分", "渗液评分", "肉芽评分", "坏死评分"],
  ai_providers: ["openai", "gemini", "deepseek", "kimi", "qwen", "local"],
  message_channels: ["站内消息", "短信接口预留", "微信接口预留"],
};
