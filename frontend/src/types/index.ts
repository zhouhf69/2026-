export interface DashboardMetrics {
  current_projects: number;
  hospital_preparations: number;
  enrolled_cases: number;
  wound_images: number;
  followup_completion_rate: number;
  ai_analysis_tasks: number;
  adverse_events: number;
  generated_reports: number;
}

export interface PreparationItem {
  id: string;
  prep_id: string;
  name: string;
  prep_type: string;
  dosage_form: string;
  indications?: string;
  evidence_level?: string;
}

export interface ProjectItem {
  id: string;
  project_name: string;
  project_code: string;
  research_type: string;
  project_status: string;
  sample_target: number;
  current_enrollment: number;
}

export interface CaseItem {
  id: string;
  case_code: string;
  deidentified_id: string;
  age?: number;
  gender?: string;
  primary_diagnosis?: string;
  enrollment_status: string;
  followup_status: string;
}

export interface TransformationItem {
  id: string;
  transformation_name: string;
  evidence_level?: string;
  market_potential?: string;
  phase: string;
  milestones?: string;
}

export interface RoleScopeItem {
  id: string;
  code: string;
  name: string;
  menu_scope: string[];
  page_scope: string[];
  button_scope: string[];
  export_permission: boolean;
  review_permission: boolean;
}

export interface SystemConfig {
  departments: string[];
  score_scales: string[];
  ai_providers: string[];
  message_channels: string[];
}
