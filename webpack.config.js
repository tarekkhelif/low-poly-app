const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const webpack = require("webpack");

const distDir = "./dist";

module.exports = {
  entry: { reactHotLoader: "react-hot-loader/patch", main: "./src/index.js" },
  plugins: [
    new CleanWebpackPlugin([distDir]),
    new HtmlWebpackPlugin({ title: "Monsterrr" }),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ["babel-loader"]
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      }
    ]
  },
  resolve: {
    extensions: [".js", ".jsx"]
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, distDir),
    publicPath: "/"
  },
  devtool: "inline-source-map",
  devServer: {
    contentBase: distDir,
    port: 3003,
    hot: true
  }
};
