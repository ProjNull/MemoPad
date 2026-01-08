import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'



// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  const base = {
    plugins: [
      vue(),
      vueDevTools(),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
    },
    server: {}
  }

  if (env.VITE_API_PROXY) {
    console.log("\n=== Using API Proxy! ===\n")
    base.server["proxy"] = {
      '/api': { target: env.VITE_API_PROXY , changeOrigin: true, }
    } 
  }

  return base;
})
