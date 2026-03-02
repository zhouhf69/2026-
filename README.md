# 2026 八篇论文计划 Web 看板

督促型论文进度看板，一眼看全局，支持甘特图、任务中心、论文详情。

## 在线访问

部署版本：**https://paper-board.vercel.app**（数据存于本机 localStorage）

## 快速启动

**推荐**：将项目放在纯英文路径（如 `D:\paper-board`），避免中文路径导致的安装问题。

```bash
cd D:\paper-board   # 或 cd paper-board
npm install
npm run dev
```

或双击 `run.bat`（Windows）：自动检测依赖并启动开发服务器。

浏览器打开 [http://localhost:3000](http://localhost:3000)，默认跳转到 `/dashboard`。

## 功能概览

- **总览 Dashboard** (`/dashboard`)：KPI 卡片、今日任务、逾期任务、本周里程碑、论文列表
- **甘特图** (`/gantt`)：Day/Week/Month 视图、按论文/赛道/状态/负责人过滤、点击任务弹侧边栏编辑
- **任务中心** (`/tasks`)：今天/明天/本周日程、快速勾选完成、标记阻塞
- **论文列表** (`/papers`)：按赛道筛选、搜索、论文卡片
- **论文详情** (`/papers/[id]`)：论文信息、进度条、目标期刊、任务列表（可编辑/删除）、文档链接
- **设置** (`/settings`)：主题切换、负责人字典、每日提醒、导入/导出 JSON、导出 CSV

## 数据持久化

- MVP 使用 **localStorage** 持久化
- 首次访问自动从 `public/seed.json` 加载 8 篇论文及任务
- 修改任务/论文后自动保存到 localStorage

## 重置为初始数据

清除浏览器 localStorage 中 `paper-board-data` 键，刷新页面即可重新加载 seed 数据。

或在控制台执行：
```javascript
localStorage.removeItem('paper-board-data');
location.reload();
```

## 如何添加论文/任务

1. **添加论文**：需修改 `public/seed.json` 中 `papers` 数组，或后续扩展设置页
2. **添加任务**：论文详情页可扩展“新增任务”按钮；或直接编辑 `seed.json` 后重置

## 技术栈

- Next.js 16 + TypeScript + Tailwind CSS 4
- 甘特图：自定义实现（无第三方库依赖）
- 数据：JSON seed + localStorage

## 红黄绿灯风险规则

- **绿灯**：距投稿 ≥ 14 天，或进度 ≥ 60%
- **橙灯**：距投稿 7–14 天 且 进度 < 60%
- **黄灯**：距投稿 3–7 天 且 进度 < 60%
- **红灯**：距投稿 < 3 天 且 进度 < 60%

## 甘特图拖拽

- 在甘特图页面，可拖拽任务条左右移动以调整日期
- 拖拽后自动保存到 localStorage

## 文档链接

- 在论文详情页可添加、编辑、删除文档链接（Google Doc、Notion、本地路径等）

## 主题与每日提醒

- **主题**：导航栏或设置页可切换浅色/深色/跟随系统
- **每日提醒**：设置页开启后，09:00 后首次访问时推送「今日到期 + 逾期」桌面通知
- **移动端**：小屏下导航折叠为汉堡菜单

## 键盘快捷键

按 `g` 后按以下键快速跳转：`d` 总览 · `p` 论文 · `g` 甘特图 · `t` 任务中心 · `s` 设置
