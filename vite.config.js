import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { fileURLToPath } from 'url'
import { NodePackageImporter } from 'sass-embedded'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig(({ command }) => {

  return {
    plugins: [react()],
    base: "/fitlab-frontend/",
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@assets': path.resolve(__dirname, './src/assets'),
        '@components': path.resolve(__dirname, './src/components'),
        '@contexts': path.resolve(__dirname, './src/contexts'),
        '@hooks': path.resolve(__dirname, './src/hooks'),
        '@pages': path.resolve(__dirname, './src/pages'),
        '@services': path.resolve(__dirname, './src/services'),
        '@layout': path.resolve(__dirname, './src/layout'),
        '@styles': path.resolve(__dirname, './src/styles'),
        '@static': path.resolve(__dirname, './src/static'),
      },
    },

    css: {
      preprocessorOptions: {
        scss: {
          importer: [new NodePackageImporter()]
        }
      }
    }
  }
})
