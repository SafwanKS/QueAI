import {
  defineConfig
} from 'vite'
import react from '@vitejs/plugin-react'
const host = process.env.TAURI_DEV_HOST;

const manifestForPlugin = {
  registerType: 'autoUpdate',
  injectRegister: 'script',
  includeAssets: ['favicon.ico',
    'apple-touch-icon.png',
    'masked-icon.svg'],
  manifest: {
    name: 'QueAI',
    short_name: 'QueAI',
    description: '',
    icons: [{
      src: '/android-chrome-192x192.png',
      sizes: '192x192',
      type: 'image/png',
    },
    {
      src: '/android-chrome-512x512.png',
      sizes: '512x512',
      type: 'image/png',
    },
    {
      src: '/apple-touch-icon.png',
      sizes: '180x180',
      type: 'image/png',
      purpose: 'apple touch icon',
    },
    {
      src: '/maskable_icon.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'maskable',
    }],
    workbox: {
      cleanupOutdatedCaches: true
    },
    theme_color: '#101218',
    background_color: '#101218',
    display: "standalone",
    scope: '/',
    start_url: "/",
    orientation: "portrait"
  }
}





// https://vite.dev/config/
export default defineConfig({
  base: "./",
  plugins: [react(),
    // VitePWA(manifestForPlugin)
  ],

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent Vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
        protocol: "ws",
        host,
        port: 1421,
      }
      : undefined,
    watch: {
      // 3. tell Vite to ignore watching `src-tauri`
      ignored: ["**/src-tauri/**"],
    },
  },
})
