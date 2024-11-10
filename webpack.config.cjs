const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");

module.exports = {
  mode: "development", // or 'production' based on your needs
  entry: "./src/main.tsx", // entry point for your app
  cache: {
    type: "filesystem",
  },
  stats: "verbose",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /(node_modules)/,
        use: {
          loader: "swc-loader",
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./webpack.html",
      inject: "body",
    }),
    new ReactRefreshWebpackPlugin({
      esModule: true,
    }),
  ],
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
  },
  devServer: {
    static: path.resolve(__dirname, "public"),
    hot: true,
    open: true,
    compress: true,
  },
};
