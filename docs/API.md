# PrepRWS AI API 文档（MVP）

Base URL: `http://localhost:8000/api/v1`

## 1) 认证

### POST `/auth/login`

请求：

```json
{
  "username": "admin",
  "password": "Admin123!"
}
```

响应：

```json
{
  "access_token": "jwt-token",
  "token_type": "bearer"
}
```

### GET `/auth/me`

Header: `Authorization: Bearer <token>`

---

## 2) Dashboard

### GET `/dashboard/overview`

返回KPI与趋势图数据（含MVP演示固定指标）。

---

## 3) 制剂管理

- GET `/preparations`
- POST `/preparations`
- GET `/preparations/{id}`
- PUT `/preparations/{id}`
- DELETE `/preparations/{id}`

---

## 4) 研究项目管理

- GET `/projects`
- POST `/projects`
- GET `/projects/{id}`
- PUT `/projects/{id}`

---

## 5) 病例管理

- GET `/cases`
- POST `/cases`
- GET `/cases/{id}`

说明：病例接口仅接受脱敏ID，不存储姓名/身份证/手机号等敏感标识。

---

## 6) 创面图像与AI占位分析

- POST `/wounds`
- POST `/wounds/images/upload` (multipart/form-data)
- GET `/wounds/images`
- GET `/wounds/analysis/{analysis_id}`
- PUT `/wounds/analysis/{analysis_id}/review`

---

## 7) 随访管理

- GET `/followups/plans`
- POST `/followups/plans`
- GET `/followups/records`
- POST `/followups/records`
- GET `/followups/missing-reminders`

---

## 8) SOP中心

- GET `/sops/templates`
- POST `/sops/templates`
- GET `/sops/versions`
- POST `/sops/versions`

---

## 9) AI科研助手

### POST `/ai/generate`

请求：

```json
{
  "provider": "openai",
  "task_type": "sop",
  "input": {
    "preparation_name": "生肌玉红膏",
    "indication": "慢性创面"
  }
}
```

响应包含统一声明：

> AI辅助建议，仅供临床研究和医生审核参考，不能替代医生判断。

---

## 10) 审计中心

- GET `/audit/logs`
- GET `/audit/consent`（接口预留）
- GET `/audit/ethics`（接口预留）
