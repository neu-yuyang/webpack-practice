const path = require("path")
const { merge } = require("webpack-merge")
// 生成gzip文件
const CompressionWebpackPlugin = require("compression-webpack-plugin")
// 分析打包出来文件的大小
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin
// 将css提出为独立文件的插件
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
// 生成html5，并在body中使用script标签引入打包后的js文件
const HtmlWebpackPlugin = require("html-webpack-plugin")
// 清理dist文件夹
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
// 压缩器，用于替代webpack自带的压缩器
const TerserJSPlugin = require("terser-webpack-plugin")
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin")

const base = require("./webpack.base")
const { module } = require("./webpack.dev")
const config = {
  bundleAnalyzerReport: false,
  productionGzip: true
}
const webpackConfig = merge(base, {
  mode: "production",
  output: {
    filename: "[name].[chunkhash].js",
    path: path.resolve(__dirname, "../dist")
  },
  // source-map: 整个source map 作为独立文件生成，并未bundle添加一个引用注释。
  devtool: "source-map",
  optimization: {
    minimizer: [new TerserJSPlugin(), new OptimizeCSSAssetsPlugin()],
    splitChunks: {
      chunks: "all"
    }
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              esModule: true
            }
          },
          "css-loader"
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: "[name].[chunkhash].css"
    }),
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "index.html",
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
      },
      inject: true
    })
  ]
})
// 生成gzip文件
if (config.productionGzip) {
  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      test: new RegExp("\\.(js|css)$"),
      threshold: 10240,
      minRatio: 0.8
    })
  )
}

if (config.bundleAnalyzerReport) {
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig
