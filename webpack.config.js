/*
 * @Author: wangzhong
 * @Date: 2020-07-07 16:38:43
 * @LastEditors: wangzhong
 * @LastEditTime: 2020-12-04 18:15:16
 * @FilePath: /iceZoneChild/webpack.config.js
 */
const path = require("path");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const StatsPlugin = require("stats-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const getParam = (str) => {
  const args = process.argv;
  const param = args.find((item) => {
    return item.match(str);
  });
  if (param) {
    return param.split("=")[1];
  }
  return null;
};

const serverUrl = getParam("--serverUrl");
const shouldClear = Number(getParam("--clearUnUseless"));


module.exports = function (webpackEnv) {
  const isReact = webpackEnv !== "production";
  return {
    optimization: {
      minimizer: [
        new TerserPlugin({
          // 加快构建速度
          cache: false, // 开启缓存
          parallel: 4, // 多线程打包
          terserOptions: shouldClear
            ? {
                compress: {
                  unused: true, // 剔除无用代码
                  drop_debugger: true, // 剔除debugger
                  drop_console: true, // 剔除console
                  dead_code: true,
                },
              }
            : {},
        }),
      ],
    },
    resolve: {
      extensions: [
        ".js",
        ".jsx",
        {{#if useTs}}
        ".ts",
        ".tsx",
        {{/if}}
        ".json"
      ],
    },
    entry: isReact
      ? path.resolve(__dirname, "src/index.js")
      : {
          singleSpaEntry: path.resolve(__dirname, "src/singleSpaEntry.js"),
          {{#if hasStore}}
          store: path.resolve(__dirname, "src/store.js"),
          {{/if}}
        },
    output: !isReact
      ? {
          filename: "[name]_[hash:16].js",
          libraryTarget: "amd",
          library: "reactApp",
          publicPath: serverUrl,
          // publicPath: "http://localhost:9001/",
          path: path.resolve(__dirname, "build"),
        }
      : {
          filename: "main.js",
          publicPath: serverUrl,
        },
    module: {
      rules: [
        {{#if useEslint}}
        {
          test: /\.(js|jsx|ts|tsx)$/,
          enforce: "pre",
          use: [
            {
              loader: "eslint-loader",
              options: { fix: true },
            },
          ],
          include: path.resolve(__dirname, "./src"),
          exclude: /node_modules/,
        },
        {{/if}}
        {
          test: /\.less$/,
          use: [
            {
              loader: "style-loader", // creates style nodes from JS strings
            },
            {
              loader: "css-loader", // translates CSS into CommonJS
            },
            {
              loader: "less-loader", // compiles Less to CSS
            },
          ],
        },
        {
          {{#if useTs}}
          test: /\.(js|jsx|ts|tsx)?$/,
          {{else}}
          test: /\.(js|jsx)?$/,
          {{/if}}
          exclude: [path.resolve(__dirname, "node_modules")],
          use: {
            loader: "babel-loader",
            options: {
              babelrc: false,
              presets: [
                require.resolve("@babel/preset-env"),
                require.resolve("@babel/preset-react"),
                {{#if useTs}}
                require.resolve("@babel/preset-typescript"),
                {{/if}}
              ],
            },
          },
        },
        {
          test: /\.(png|jpg|gif)$/,
          use: [
            {
              loader: "file-loader",
              options: {
                name: "[path][name]_[hash:8].[ext]",
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new HtmlWebPackPlugin({
        filename: "index.html",
        template: path.resolve(__dirname, "index.html"),
      }),
      new StatsPlugin("manifest.json", {
        chunkModules: false,
        entrypoints: true,
        source: false,
        chunks: false,
        modules: false,
        assets: false,
        children: false,
        exclude: [/node_modules[\\\/]react/],
      }),
      new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
    ],
    devtool: shouldClear ? false : "eval-source-map",
    devServer: {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      contentBase: path.resolve(__dirname, "build"),
      historyApiFallback: true,
      host: "0.0.0.0",
      hot: true,
    },
  };
};
