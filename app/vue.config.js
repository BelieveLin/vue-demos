const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  // productionSourceMap: false,
  devServer: {
    host: 'localhost',
    open: true,
    proxy: {
      '/api': {
        target: "http://gmall-h5-api.atguigu.cn",
        // pathRewrite: { "^/api": "" }
        // http://39.98.123.211:8510
      }
    }
  },
})
