# 部署到公开网络

本项目可一键部署到 Vercel（免费），获得公网可访问的 URL。

## 方式一：Vercel CLI（推荐）

### 1. 安装 Vercel CLI（可选，也可用 npx）

```bash
npm i -g vercel
```

### 2. 部署

```bash
cd D:\paper-board
npx vercel
```

首次运行会提示：
- 登录 Vercel 账号（可用 GitHub 登录）
- 确认项目设置（直接回车即可）

部署完成后会得到类似 `https://paper-board-xxx.vercel.app` 的地址。当前生产地址：**https://paper-board.vercel.app**

### 3. 部署到生产环境

```bash
npx vercel --prod
```

## 方式二：GitHub + Vercel 自动部署（推荐长期使用）

推送代码到 GitHub 后，Vercel 会监听仓库变动并**自动重新部署**。

### 1. 初始化 Git 并推送到 GitHub

```bash
cd D:\paper-board
git init
git add .
git commit -m "Initial commit"
```

在 [github.com/new](https://github.com/new) 创建新仓库（如 `paper-board`），然后：

```bash
git remote add origin https://github.com/你的用户名/paper-board.git
git branch -M main
git push -u origin main
```

### 2. 在 Vercel 中关联 GitHub

1. 打开 [vercel.com/new](https://vercel.com/new) 并登录
2. 点击「Import Git Repository」→ 选择你的 GitHub 仓库
3. 如已有项目，进入 [vercel.com/zhouhf69s-projects/paper-board/settings/git](https://vercel.com/zhouhf69s-projects/paper-board/settings/git) 连接 GitHub
4. 关联后，每次 `git push` 到 `main` 会自动触发生产部署

### 3. 已有 CLI 部署的项目如何改连 GitHub

若已通过 `npx vercel` 部署过，在 Vercel 项目 → Settings → Git 中连接 GitHub 仓库即可。之后用 `git push` 替代手动 `vercel --prod`。

---

## 自定义域名

1. 打开 [vercel.com](https://vercel.com) → 你的项目 → **Settings** → **Domains**
2. 点击 **Add**，输入域名（如 `papers.yourdomain.com`）
3. 按提示在域名服务商添加 DNS 记录：
   - **CNAME**：`papers` → `cname.vercel-dns.com`
   - 或 **A**：`@` → `76.76.21.21`（根域名）
4. 等待 DNS 生效（数分钟到数小时），Vercel 自动配置 HTTPS

## 方式三：阿里无影云电脑

> **重要**：无影云电脑通常**没有公网 IP**，无法像 Vercel 那样让任何人通过网址访问。[参考](https://developer.aliyun.com/ask/593001)  
> 适合：在云电脑**内部**运行，你远程登录后自己使用；不适合：对外提供公开访问。

### 在无影云电脑内运行（仅自己用）

1. 远程连接无影云电脑（RDP 或 Web 客户端）
2. 在云电脑内执行：

```bash
git clone https://github.com/zhouhf69/2026-.git
cd 2026-
npm install
npm run dev
```

3. 在云电脑内置浏览器打开 `http://localhost:3000` 即可使用  
4. 若希望云电脑关机后下次开机快速恢复，可执行 `npm run build && npm run start` 并用 PM2 常驻：

```bash
npm i -g pm2
npm run build
pm2 start npm --name "paper-board" -- start
pm2 save
pm2 startup   # 按提示配置开机自启
```

### 代码镜像（国内克隆加速）

若从国内访问 GitHub 较慢，可把仓库镜像到 [Gitee](https://gitee.com) 或 [阿里云 Code](https://code.aliyun.com)：

- **Gitee**：新建仓库 → 导入 GitHub 仓库 `https://github.com/zhouhf69/2026-`
- **阿里云 Code**：新建仓库 → 导入 → 填写 GitHub 地址

之后在无影云电脑内用 `git clone` 镜像地址，速度更快。

### 需要公网访问时

若要像 Vercel 那样**公网可访问**，需使用阿里云 **ECS 云服务器**（有公网 IP），而不是无影云电脑。参考 [阿里云部署 Node.js 教程](https://developer.aliyun.com/article/1150489)。

---

## 方式四：其他平台

- **Netlify**：`npx netlify deploy`
- **Cloudflare Pages**：连接 GitHub 或使用 Wrangler
- **Railway**：`npx railway up`

## 注意事项

- **数据存储**：当前使用浏览器 localStorage，部署后每位访客的数据独立，不共享
- **无后端**：纯前端应用，无需配置数据库或 API
- **HTTPS**：Vercel 自动提供 HTTPS

---

## 后续扩展

### 多端同步（Supabase / Firebase）

接入云端数据库后，可实现在不同设备间共享同一份数据：

| 方案 | 特点 | 主要工作 |
|------|------|----------|
| **Supabase** | PostgreSQL、Row Level Security、免费额度大 | 创建项目 → 替换 `DataContext` 为 Supabase client → 可选登录 |
| **Firebase** | Realtime 同步、Auth 完善 | Firestore + `onSnapshot` → 替换 localStorage 读写 |

核心改动：将 `src/context/DataContext.tsx` 中的 `localStorage` 读写改为调用云端 API，并处理离线/冲突。

### 功能扩展

| 功能 | 说明 |
|------|------|
| **批量导入** | 设置页上传 Excel/CSV，解析后批量添加论文与任务 |
| **更多统计** | 按负责人工作量、赛道完成率趋势、逾期分布图等 |
| **提醒增强** | 邮件/Slack 提醒、截止日前 N 天自动推送 |
| **权限与协作** | 多人编辑、邀请链接、角色（只读/编辑） |
