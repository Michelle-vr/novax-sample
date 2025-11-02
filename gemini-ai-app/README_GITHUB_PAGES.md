# 🚀 快速部署到 GitHub Pages

## 一键部署（推荐）

```bash
cd gemini-ai-app
bun run deploy
```

## 手动部署步骤

### 1️⃣ 创建 GitHub 仓库
- 登录 GitHub
- 创建新仓库（必须是 Public）
- 复制仓库地址

### 2️⃣ 配置 API 密钥
编辑 `src/config/web3.ts`：
```typescript
export const projectId = 'YOUR_WALLETCONNECT_PROJECT_ID'
```

### 3️⃣ 推送代码
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/你的用户名/仓库名.git
git push -u origin main
```

### 4️⃣ 启用 GitHub Pages
1. 进入仓库 Settings → Pages
2. Source 选择 "GitHub Actions"
3. 等待自动部署完成（2-5分钟）

### 5️⃣ 访问你的网站
```
https://你的用户名.github.io/仓库名/
```

## 📝 重要配置

### 如果仓库名不是用户页面
更新 `vite.config.ts`：
```typescript
base: '/你的仓库名/'
```

### 如果使用自定义域名
在 `public/` 目录创建 `CNAME` 文件：
```
yourdomain.com
```

## ✅ 部署检查

- [ ] WalletConnect Project ID 已配置
- [ ] GitHub Pages 已启用
- [ ] 等待 Actions 构建完成
- [ ] 网站可以访问
- [ ] 钱包连接正常
- [ ] 所有功能正常

## 🔄 更新部署

修改代码后：
```bash
git add .
git commit -m "更新说明"
git push
```

GitHub Actions 会自动重新部署！

## 📚 详细文档

查看完整部署指南：`GITHUB_PAGES_部署指南.md`

---

**遇到问题？** 查看 GitHub Actions 日志或浏览器控制台错误信息。
