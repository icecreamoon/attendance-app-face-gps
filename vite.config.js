import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',     // 出力先フォルダ
    assetsDir: '',      // assets を dist直下に配置（index.htmlも直下に出力される）
  },
})

