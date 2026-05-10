-- PrepRWS AI PostgreSQL schema (MVP)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  description VARCHAR(255),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  created_by VARCHAR(64),
  updated_by VARCHAR(64)
);

CREATE TABLE IF NOT EXISTS departments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(120) UNIQUE NOT NULL,
  hospital_name VARCHAR(120),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  created_by VARCHAR(64),
  updated_by VARCHAR(64)
);

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(64) UNIQUE NOT NULL,
  email VARCHAR(128),
  full_name VARCHAR(128),
  hashed_password VARCHAR(255) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  role_id UUID REFERENCES roles(id),
  department_id UUID REFERENCES departments(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  created_by VARCHAR(64),
  updated_by VARCHAR(64)
);

CREATE TABLE IF NOT EXISTS hospital_preparations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  prep_id VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(120) NOT NULL,
  english_name VARCHAR(120),
  prep_type VARCHAR(50) NOT NULL,
  dosage_form VARCHAR(50) NOT NULL,
  formula_source TEXT,
  classic_reference TEXT,
  ingredients TEXT,
  indications TEXT,
  contraindications TEXT,
  usage_dosage TEXT,
  adverse_reactions TEXT,
  approval_info VARCHAR(255),
  qc_points TEXT,
  evidence_level VARCHAR(50),
  related_case_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  created_by VARCHAR(64),
  updated_by VARCHAR(64)
);

CREATE TABLE IF NOT EXISTS preparation_batches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  preparation_id UUID REFERENCES hospital_preparations(id),
  batch_no VARCHAR(80) NOT NULL,
  manufacture_date VARCHAR(20),
  expiry_date VARCHAR(20),
  qc_summary TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  created_by VARCHAR(64),
  updated_by VARCHAR(64)
);

CREATE TABLE IF NOT EXISTS research_projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_name VARCHAR(255) NOT NULL,
  project_code VARCHAR(80) UNIQUE NOT NULL,
  research_type VARCHAR(80) NOT NULL,
  objective TEXT,
  hypothesis TEXT,
  pi_name VARCHAR(120),
  departments VARCHAR(255),
  centers VARCHAR(255),
  start_date VARCHAR(20),
  end_date VARCHAR(20),
  sample_target INTEGER NOT NULL DEFAULT 0,
  current_enrollment INTEGER NOT NULL DEFAULT 0,
  inclusion_criteria TEXT,
  exclusion_criteria TEXT,
  primary_endpoints TEXT,
  secondary_endpoints TEXT,
  safety_indicators TEXT,
  followup_nodes VARCHAR(255),
  ethics_status VARCHAR(50),
  consent_status VARCHAR(50),
  project_status VARCHAR(50) NOT NULL DEFAULT '草稿',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  created_by VARCHAR(64),
  updated_by VARCHAR(64)
);

CREATE TABLE IF NOT EXISTS project_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES research_projects(id),
  user_id UUID REFERENCES users(id),
  role_in_project VARCHAR(80) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  created_by VARCHAR(64),
  updated_by VARCHAR(64)
);

CREATE TABLE IF NOT EXISTS patients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  deidentified_id VARCHAR(80) UNIQUE NOT NULL,
  age INTEGER,
  gender VARCHAR(20),
  bmi DOUBLE PRECISION,
  primary_diagnosis VARCHAR(255),
  comorbidities TEXT,
  history TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  created_by VARCHAR(64),
  updated_by VARCHAR(64)
);

CREATE TABLE IF NOT EXISTS cases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_code VARCHAR(80) UNIQUE NOT NULL,
  patient_id UUID REFERENCES patients(id),
  project_id UUID REFERENCES research_projects(id),
  preparation_id UUID REFERENCES hospital_preparations(id),
  current_medication TEXT,
  usage_start_time VARCHAR(30),
  usage_frequency VARCHAR(50),
  enrollment_status VARCHAR(50) NOT NULL DEFAULT '已入组',
  followup_status VARCHAR(50) NOT NULL DEFAULT '待随访',
  efficacy_status VARCHAR(50),
  adverse_event_status VARCHAR(50) NOT NULL DEFAULT '无',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  created_by VARCHAR(64),
  updated_by VARCHAR(64)
);

CREATE TABLE IF NOT EXISTS wounds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id UUID REFERENCES cases(id),
  location VARCHAR(120),
  wound_type VARCHAR(120),
  baseline_area DOUBLE PRECISION,
  pain_score INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  created_by VARCHAR(64),
  updated_by VARCHAR(64)
);

CREATE TABLE IF NOT EXISTS wound_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wound_id UUID REFERENCES wounds(id),
  file_url VARCHAR(255) NOT NULL,
  shot_time VARCHAR(30),
  shot_site VARCHAR(120),
  shot_angle VARCHAR(80),
  sop_compliant BOOLEAN NOT NULL DEFAULT TRUE,
  quality_score DOUBLE PRECISION,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  created_by VARCHAR(64),
  updated_by VARCHAR(64)
);

CREATE TABLE IF NOT EXISTS ai_image_analysis (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wound_image_id UUID REFERENCES wound_images(id),
  wound_area DOUBLE PRECISION,
  redness_score INTEGER,
  exudate_score INTEGER,
  granulation_score INTEGER,
  necrosis_score INTEGER,
  infection_risk_score INTEGER,
  healing_percentage DOUBLE PRECISION,
  confidence_score DOUBLE PRECISION,
  ai_comment TEXT,
  doctor_review_status VARCHAR(50) NOT NULL DEFAULT '待审核',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  created_by VARCHAR(64),
  updated_by VARCHAR(64)
);

CREATE TABLE IF NOT EXISTS followup_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id UUID REFERENCES cases(id),
  plan_name VARCHAR(120) NOT NULL,
  nodes VARCHAR(120) NOT NULL DEFAULT 'D1,D3,D7,D14,D30,D60,D90',
  status VARCHAR(50) NOT NULL DEFAULT '进行中',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  created_by VARCHAR(64),
  updated_by VARCHAR(64)
);

CREATE TABLE IF NOT EXISTS followup_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plan_id UUID REFERENCES followup_plans(id),
  node_day VARCHAR(20) NOT NULL,
  pain_score INTEGER,
  itch_score INTEGER,
  exudate_status VARCHAR(120),
  dressing_frequency VARCHAR(80),
  compliance VARCHAR(80),
  adverse_reaction TEXT,
  satisfaction INTEGER,
  recurrence VARCHAR(80),
  missing_flag BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  created_by VARCHAR(64),
  updated_by VARCHAR(64)
);

CREATE TABLE IF NOT EXISTS sop_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  sop_type VARCHAR(80) NOT NULL,
  disease_scope VARCHAR(255),
  preparation_scope VARCHAR(255),
  department_scope VARCHAR(255),
  owner VARCHAR(120),
  approval_status VARCHAR(50) NOT NULL DEFAULT '草稿',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  created_by VARCHAR(64),
  updated_by VARCHAR(64)
);

CREATE TABLE IF NOT EXISTS sop_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sop_template_id UUID REFERENCES sop_templates(id),
  version_no VARCHAR(20) NOT NULL,
  effective_date VARCHAR(20),
  operation_steps TEXT,
  qc_points TEXT,
  risk_points TEXT,
  ai_suggestion TEXT,
  revision_log TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  created_by VARCHAR(64),
  updated_by VARCHAR(64)
);

CREATE TABLE IF NOT EXISTS crf_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES research_projects(id),
  name VARCHAR(255) NOT NULL,
  crf_type VARCHAR(80) NOT NULL,
  schema_json TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  created_by VARCHAR(64),
  updated_by VARCHAR(64)
);

CREATE TABLE IF NOT EXISTS crf_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  template_id UUID REFERENCES crf_templates(id),
  case_id UUID REFERENCES cases(id),
  form_data TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  created_by VARCHAR(64),
  updated_by VARCHAR(64)
);

CREATE TABLE IF NOT EXISTS adverse_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id UUID REFERENCES cases(id),
  event_term VARCHAR(255) NOT NULL,
  severity VARCHAR(50) NOT NULL,
  relation_to_drug VARCHAR(50),
  action_taken TEXT,
  outcome VARCHAR(100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  created_by VARCHAR(64),
  updated_by VARCHAR(64)
);

CREATE TABLE IF NOT EXISTS evidence_packages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES research_projects(id),
  package_name VARCHAR(255) NOT NULL,
  package_type VARCHAR(80) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT '草稿',
  summary TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  created_by VARCHAR(64),
  updated_by VARCHAR(64)
);

CREATE TABLE IF NOT EXISTS transformation_projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES research_projects(id),
  transformation_name VARCHAR(255) NOT NULL,
  evidence_level VARCHAR(50),
  market_potential VARCHAR(50),
  phase VARCHAR(50) NOT NULL DEFAULT '临床经验积累',
  milestones TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  created_by VARCHAR(64),
  updated_by VARCHAR(64)
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  log_type VARCHAR(80) NOT NULL,
  action VARCHAR(120) NOT NULL,
  target_type VARCHAR(80) NOT NULL,
  target_id VARCHAR(80),
  actor VARCHAR(80),
  detail TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  created_by VARCHAR(64),
  updated_by VARCHAR(64)
);

CREATE TABLE IF NOT EXISTS ai_prompts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_type VARCHAR(80) NOT NULL,
  provider VARCHAR(30) NOT NULL,
  payload TEXT NOT NULL,
  requester_id UUID REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  created_by VARCHAR(64),
  updated_by VARCHAR(64)
);

CREATE TABLE IF NOT EXISTS ai_outputs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  prompt_id UUID REFERENCES ai_prompts(id),
  output_text TEXT NOT NULL,
  review_status VARCHAR(50) NOT NULL DEFAULT '待医生审核',
  reviewer VARCHAR(120),
  reviewed_at VARCHAR(30),
  modify_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  created_by VARCHAR(64),
  updated_by VARCHAR(64)
);

CREATE TABLE IF NOT EXISTS attachments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  biz_type VARCHAR(80) NOT NULL,
  biz_id VARCHAR(80) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_url VARCHAR(255) NOT NULL,
  file_type VARCHAR(50),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  created_by VARCHAR(64),
  updated_by VARCHAR(64)
);
