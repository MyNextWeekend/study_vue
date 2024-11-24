import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'


export default defineConfig({
  // resolve: {
  //   alias: {
  //     // 设置家目录别名
  //     "~": path.resolve(__dirname, "src")
  //   }
  // },
  plugins: [vue()],
  server: {
    proxy: { //设置代理
      '/path': { //链接中的代理标示，没有这个就不走代理
        target: 'http://127.0.0.1:8000', //设置代理地址
        changeOrigin: true, //开启代理
        rewrite: path=>path.replace(/^\/path/, '') //重写路径
      }
    }
  }
})