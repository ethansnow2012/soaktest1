const path = require("path");

module.exports = {
  outputDir: path.resolve(__dirname, "./dist"),
  chainWebpack: config => {
    config
      .plugin("html")
      .tap(args => {
        args[0].template = "./index_vue.html"
        return args
      })
  },
  css: {
    loaderOptions: {
      scss: {
        additionalData: `
        @import "./src/css_variables.scss";
        @import "./src/css_functional.scss";
        `
      },
    }
  }
}