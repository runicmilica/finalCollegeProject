const { defineConfig } = require('@vue/cli-service')
const { DefinePlugin } = require('webpack');

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    plugins: [
      new DefinePlugin({
        '__VUE_OPTIONS_API__': JSON.stringify(true),  // Enable or disable Options API based on your use
        '__VUE_PROD_DEVTOOLS__': JSON.stringify(true), // Disable devtools in production
        '__VUE_PROD_HYDRATION_MISMATCH_DETAILS__': JSON.stringify(true) // Set according to your needs
      })
    ]
  }
})
