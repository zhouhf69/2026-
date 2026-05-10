# AI辅助院内制剂真实世界研究与循证转化平台（PrepRWS AI）

> 让经验方成为证据资产，让院内制剂走向循证转化。  
> 面向经典名方、外用药与院内制剂的AI真实世界研究操作系统。

本仓库提供一个可运行的 **MVP 全栈工程**：

- 前端：**Vue 3 + TypeScript + Tailwind + Vue Router + Pinia + ECharts**
- 后端：**FastAPI + SQLAlchemy + Alembic + PostgreSQL + Redis + JWT + RBAC**
- 部署：**Docker / docker-compose**

---

## 目录结构

```text
.
├── frontend/                    # Vue前端
│   ├── src/
│   │   ├── api/                 # API封装
│   │   ├── components/          # 布局与通用组件
│   │   ├── mock/                # 演示数据
│   │   ├── router/              # 23个核心页面路由
│   │   ├── stores/              # Pinia状态
│   │   ├── types/               # TS类型
│   │   └── views/               # 页面实现
│   ├── Dockerfile
│   └── package.json
├── backend/                     # FastAPI后端
│   ├── app/
│   │   ├── api/routes/          # 业务路由
│   │   ├── core/                # 配置/数据库/依赖
│   │   ├── models/              # SQLAlchemy模型
│   │   ├── schemas/             # Pydantic模型
│   │   ├── services/            # AI/上传/审计服务
│   │   ├── auth/                # JWT封装
│   │   └── rbac/                # 权限映射
│   ├── alembic/                 # 迁移配置
│   ├── sql/schema.sql           # PostgreSQL建表SQL
│   ├── seed.py                  # 样例数据初始化
│   ├── requirements.txt
│   └── Dockerfile
├── docs/API.md                  # 接口文档
├── docker-compose.yml
├── Dockerfile                   # 根镜像（默认后端）
└── .env.example
```

---

## MVP 覆盖功能

### 已实现（MVP-1 ~ MVP-8）

1. 登录与JWT鉴权 + 简化RBAC  
2. 院内制剂库（增删改查核心）  
3. 研究项目管理（创建/查看/更新）  
4. 脱敏病例管理（仅脱敏ID）  
5. 创面图像上传 + AI分析占位 + 医生审核状态  
6. 随访计划/记录 + 缺失提醒  
7. SOP模板/版本管理 + AI建议占位  
8. Dashboard统计卡片 + 趋势图 + 分布图  

### 首页演示指标（按需求内置）

- 当前项目：12个
- 院内制剂：38个
- 入组病例：286例
- 创面图片：1248张
- 随访完成率：82%
- AI分析任务：936次
- 不良反应：6例
- 生成报告：18份

---

## 样例业务数据

### 样例制剂（8个）

1. 复方黄柏液外用制剂  
2. 生肌玉红膏  
3. 肛周熏洗方  
4. 造口护肤膏  
5. 肠瘘创面湿敷方  
6. 慢性创面生肌散  
7. 糖足清创外洗方  
8. 术后切口修复膏  

### 样例研究项目（4个）

1. 肠瘘创面外用制剂真实世界疗效观察  
2. 生肌玉红膏促进慢性创面愈合的真实世界研究  
3. 肛周熏洗方用于肛瘘术后疼痛与水肿改善的临床观察  
4. 造口周围皮炎外用制剂疗效评价研究  

---

## 本地运行（不使用Docker）

### 1) 启动后端

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
alembic upgrade head
python seed.py
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 2) 启动前端

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

访问：

- 前端：http://localhost:5173
- 后端API文档：http://localhost:8000/docs

演示账号：

- `admin / Admin123!`

---

## Docker 一键运行

```bash
docker compose up --build
```

服务端口：

- frontend: 5173
- backend: 8000
- postgres: 5432
- redis: 6379
- minio: 9000（console: 9001）

---

## 合规实现说明

- 数据脱敏：病例只保留 `deidentified_id`
- 最小必要原则：按角色约束菜单与接口权限
- 全链路留痕：用户操作、数据修改、AI生成写入审计日志
- AI限制声明：所有AI输出附带“不能替代医生判断”声明
- 伦理/知情同意：接口预留，便于后续对接HIS/EMR

---

## API 文档

详细见：`docs/API.md`

---

## 后续迭代路线图

1. 完善细粒度权限（页面/按钮/数据域）与多中心数据隔离  
2. 接入真实对象存储（S3/MinIO）与异步队列（Celery任务）  
3. 接入真实图像模型（分割、面积估算、感染风险预测）  
4. 接入文本多模型路由（OpenAI/Gemini/DeepSeek/Kimi/Qwen/本地）  
5. 增加CRF动态引擎、统计分析模块（PSM/生存分析）  
6. 支持多租户SaaS模式与院内私有化部署模式  
