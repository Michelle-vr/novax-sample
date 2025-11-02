import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages 部署配置
  // 如果你的仓库名是 my-repo，则设置 base: '/my-repo/'
  // 如果使用自定义域名或用户/组织页面，则设置 base: '/'
  base: process.env.GITHUB_PAGES === 'true' ? '/' : '/',

  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  }
});
