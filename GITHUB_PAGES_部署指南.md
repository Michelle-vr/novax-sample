# NovaX 平台 - GitHub Pages 部署指南

本指南将帮助你将 NovaX 平台部署到 GitHub Pages 上。

## 📋 部署前准备

### 1. 确保你有以下账号和工具
- ✅ GitHub 账号
- ✅ Git 已安装在你的电脑上
- ✅ Bun 已安装（或使用 npm/pnpm）

### 2. 获取必要的 API 密钥

在部署前，你需要获取以下 API 密钥（可选但推荐）：

1. **WalletConnect Project ID**（必需）
   - 访问：https://cloud.walletconnect.com/
   - 注册并创建新项目
   - 复制 Project ID

2. **Etherscan API Key**（推荐）
   - 访问：https://etherscan.io/apis
   - 注册并生成 API 密钥

3. **CoinGecko API Key**（可选）
   - 访问：https://www.coingecko.com/en/api
   - 用于更高的 API 调用限制

## 🚀 快速部署步骤

### 步骤 1：创建 GitHub 仓库

1. 登录 GitHub
2. 点击右上角的 "+" → "New repository"
3. 输入仓库名称（例如：`novax-platform`）
4. 选择 "Public"（公开仓库才能使用免费的 GitHub Pages）
5. 点击 "Create repository"

### 步骤 2：配置项目

在 `gemini-ai-app/src/config/web3.ts` 文件中添加你的 WalletConnect Project ID：

```typescript
export const projectId = 'YOUR_WALLETCONNECT_PROJECT_ID' // 替换为你的实际 Project ID
```

如果你的 GitHub 仓库名不是根路径，需要更新 `vite.config.ts`：

```typescript
// 例如你的仓库名是 novax-platform
base: '/novax-platform/'

// 如果使用自定义域名或用户页面 (username.github.io)
base: '/'
```

### 步骤 3：推送代码到 GitHub

打开终端，在项目根目录执行：

```bash
# 初始化 Git 仓库（如果还没有）
git init

# 添加远程仓库（替换为你的仓库地址）
git remote add origin https://github.com/你的用户名/你的仓库名.git

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit: NovaX Platform"

# 推送到 GitHub
git push -u origin main
```

### 步骤 4：启用 GitHub Pages

1. 进入你的 GitHub 仓库页面
2. 点击 "Settings"（设置）
3. 在左侧菜单找到 "Pages"
4. 在 "Source" 下选择：
   - **Source**: GitHub Actions
5. 保存设置

### 步骤 5：触发自动部署

推送代码后，GitHub Actions 会自动开始构建和部署：

1. 在仓库页面点击 "Actions" 标签
2. 你会看到 "Deploy to GitHub Pages" 工作流正在运行
3. 等待构建完成（通常需要 2-5 分钟）
4. 完成后，你的网站将在以下地址可访问：
   - `https://你的用户名.github.io/你的仓库名/`

## 🔧 手动部署（可选）

如果你想手动部署而不使用 GitHub Actions：

```bash
# 进入项目目录
cd gemini-ai-app

# 安装依赖
bun install

# 构建项目
bun run build

# 安装 gh-pages 工具
bun add -D gh-pages

# 部署到 GitHub Pages
bunx gh-pages -d dist
```

## ⚙️ 环境变量配置（可选）

如果你想使用 GitHub Secrets 存储 API 密钥：

1. 进入仓库 Settings → Secrets and variables → Actions
2. 点击 "New repository secret"
3. 添加以下密钥：
   - `VITE_WALLETCONNECT_PROJECT_ID`
   - `VITE_ETHERSCAN_API_KEY`
   - `VITE_COINGECKO_API_KEY`

然后更新 `.github/workflows/deploy.yml`：

```yaml
- name: Build
  run: |
    cd gemini-ai-app
    bun run build
  env:
    NODE_ENV: production
    VITE_WALLETCONNECT_PROJECT_ID: ${{ secrets.VITE_WALLETCONNECT_PROJECT_ID }}
    VITE_ETHERSCAN_API_KEY: ${{ secrets.VITE_ETHERSCAN_API_KEY }}
```

## 🌐 使用自定义域名（可选）

如果你想使用自己的域名：

1. 在 `gemini-ai-app/public/` 目录创建 `CNAME` 文件
2. 在文件中写入你的域名：
   ```
   novax.yourdomain.com
   ```
3. 在你的域名服务商配置 DNS：
   - 添加 CNAME 记录指向：`你的用户名.github.io`
4. 提交并推送更改

## 📝 更新部署

每次你推送代码到 `main` 分支，GitHub Pages 会自动重新部署：

```bash
# 修改代码后
git add .
git commit -m "更新说明"
git push
```

## ✅ 部署后检查清单

部署完成后，请验证以下功能：

- [ ] 网站可以正常访问
- [ ] 钱包连接功能正常（MetaMask、WalletConnect）
- [ ] 实时价格数据正在更新
- [ ] DEX 交易功能正常
- [ ] 交易历史可以查看
- [ ] 用户认证和个人资料功能正常
- [ ] 移动端响应式设计正常
- [ ] 多语言切换正常（中文/英文）

## 🐛 常见问题

### 1. 页面显示 404 错误
- 检查 `vite.config.ts` 中的 `base` 路径是否正确
- 确认 GitHub Pages 已启用
- 等待几分钟让部署完成

### 2. 资源加载失败
- 确保 `base` 路径设置正确
- 检查浏览器控制台的错误信息

### 3. WalletConnect 无法连接
- 确认已添加正确的 Project ID
- 检查网络连接
- 尝试使用不同的钱包

### 4. 交易历史不显示
- 确认已添加 Etherscan API Key
- 检查 API 调用限制
- 查看浏览器控制台错误

### 5. 构建失败
- 检查 GitHub Actions 日志
- 确保所有依赖都已正确安装
- 验证代码没有语法错误

## 📊 性能优化建议

1. **启用 CDN**
   - GitHub Pages 已经使用 CDN，无需额外配置

2. **图片优化**
   - 使用 WebP 格式
   - 压缩所有图片资源

3. **代码分割**
   - Vite 已自动配置代码分割

4. **缓存策略**
   - 已在构建配置中启用资源哈希

## 🔒 安全建议

1. **API 密钥管理**
   - 使用 GitHub Secrets 存储敏感信息
   - 不要在代码中硬编码 API 密钥

2. **智能合约安全**
   - 先在测试网测试
   - 审计智能合约代码

3. **用户数据**
   - 当前用户数据存储在本地浏览器
   - 考虑添加后端 API 进行持久化存储

## 📱 移动端访问

你的 GitHub Pages 网站在移动设备上也能完美运行：
- 响应式设计自动适配
- 支持移动端钱包（如 MetaMask Mobile）
- 触摸优化的交互体验

## 🎉 部署成功！

恭喜！你的 NovaX 平台现在已经部署到 GitHub Pages 上了！

**你的网站地址：**
- `https://你的用户名.github.io/你的仓库名/`

分享给朋友，开始使用你的 DeFi 平台吧！

## 📞 需要帮助？

如果遇到任何问题：
1. 查看 GitHub Actions 构建日志
2. 检查浏览器控制台错误
3. 参考项目的 `PRODUCTION_DEPLOYMENT.md`
4. 联系技术支持

---

**祝你部署顺利！** 🚀
