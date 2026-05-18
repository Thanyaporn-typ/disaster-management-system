const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,

  // publicPath: '/disaster-management-system/',
  publicPath: '/',


  pages: {
    index: {
      entry: 'src/main.js',
      title: 'Disaster Management System'
    }
  }
})