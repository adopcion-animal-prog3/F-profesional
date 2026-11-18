import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    // Ruta pública del portal; en la integración completa se sirve en /profesional/.
    base: env.VITE_BASE_PATH || '/',
    plugins: [vue()],
    server: {
      host: '0.0.0.0',
      port: 5173
    }
  }
})
