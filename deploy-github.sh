#!/bin/bash

# NovaX 平台 GitHub Pages 一键部署脚本
# 使用方法: bash deploy-github.sh

echo "🚀 NovaX 平台 - GitHub Pages 部署脚本"
echo "======================================"
echo ""

# 检查是否在正确的目录
if [ ! -f "package.json" ]; then
    echo "❌ 错误：请在 gemini-ai-app 目录下运行此脚本"
    exit 1
fi

# 检查是否已配置 git remote
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "⚠️  未检测到 Git 远程仓库"
    echo ""
    echo "请先配置 GitHub 仓库："
    echo "  git remote add origin https://github.com/你的用户名/你的仓库名.git"
    echo ""
    read -p "按 Enter 继续，或 Ctrl+C 取消..."
fi

echo "📦 步骤 1/4: 安装依赖..."
bun install

if [ $? -ne 0 ]; then
    echo "❌ 依赖安装失败"
    exit 1
fi

echo ""
echo "🔨 步骤 2/4: 构建项目..."
bun run build

if [ $? -ne 0 ]; then
    echo "❌ 构建失败"
    exit 1
fi

echo ""
echo "📝 步骤 3/4: 准备部署..."

# 检查是否有 gh-pages 分支
git show-ref --verify --quiet refs/heads/gh-pages
if [ $? -ne 0 ]; then
    echo "创建 gh-pages 分支..."
    git branch gh-pages
fi

echo ""
echo "🚀 步骤 4/4: 部署到 GitHub Pages..."

# 安装 gh-pages 如果没有
if ! command -v gh-pages &> /dev/null; then
    echo "安装 gh-pages 工具..."
    bun add -D gh-pages
fi

# 部署
bunx gh-pages -d dist -m "Deploy NovaX Platform to GitHub Pages"

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 部署成功！"
    echo ""
    echo "你的网站将在几分钟后可访问："

    # 尝试获取仓库信息
    REPO_URL=$(git remote get-url origin)
    if [[ $REPO_URL =~ github.com[:/]([^/]+)/([^/.]+) ]]; then
        USERNAME="${BASH_REMATCH[1]}"
        REPONAME="${BASH_REMATCH[2]}"
        echo "  🌐 https://${USERNAME}.github.io/${REPONAME}/"
    fi

    echo ""
    echo "💡 提示："
    echo "  - 如果网站还不能访问，请等待 2-5 分钟"
    echo "  - 确保在 GitHub 仓库设置中启用了 Pages"
    echo "  - 查看部署指南：GITHUB_PAGES_部署指南.md"
else
    echo ""
    echo "❌ 部署失败"
    echo "请检查错误信息并重试"
    exit 1
fi
