const { merge } = require("webpack-merge")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const base = require("./webpack.base")

module.exports = merge(base, {
  mode: "development",
  devServer: {
    contentBase: "../dist",
    hot: true,
    host: "0.0.0.0", // 设置0.0.0.0后， 其他机器可以通过ip访问
    // port: "8080",
    quiet: false,
    clientLogLevel: "warning",
    proxy: {} // 跨域代理
  },
  devtool: "#cheap-module-eval-source-map",
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "index.html",
      inject: true
    })
  ]
})
