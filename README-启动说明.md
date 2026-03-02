# 启动说明（解决 localhost 拒绝连接）

## 问题原因

项目路径 `d:\周贝贝课题\论文计划\paper-board` 包含中文，可能导致：
- npm install 失败（ENOENT 错误）
- 依赖无法正确安装
- 开发服务器无法启动

## 推荐解决方案：将项目复制到纯英文路径

1. **复制整个 `paper-board` 文件夹** 到纯英文路径，例如：
   - `D:\paper-board`
   - `C:\Projects\paper-board`

2. **打开命令提示符或 PowerShell**，执行：

```powershell
cd D:\paper-board
npm install
npm run dev
```

3. 看到 `Ready in ...` 后，在浏览器打开 http://localhost:3000

## 若必须留在当前路径

1. 确保使用 **npm**（不要用 pnpm 混用）：
```powershell
cd "d:\周贝贝课题\论文计划\paper-board"
```

2. 删除 node_modules 和锁文件后重装：
```powershell
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item package-lock.json -ErrorAction SilentlyContinue
Remove-Item pnpm-lock.yaml -ErrorAction SilentlyContinue
npm install
```

3. 启动：
```powershell
npm run dev
```

## 已做的修改

- `next.config.ts` 已改为 `next.config.mjs`，避免 TypeScript 加载问题
- `package.json` 的 dev 脚本已改为 `npx next dev`
- 可直接双击 `启动开发服务器.bat` 尝试启动
