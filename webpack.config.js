const path = require("path")

// const ESLintPlugin = require('eslint-webpack-plugin');

// Build the lib using 1.3 in this https://dev.to/riversun/recipes-on-how-to-create-a-library-that-supports-both-browser-and-node-js-201m#(1-3)
module.exports = {
  devtool: "source-map",
  entry: path.resolve(__dirname, "src/index.js"),
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.js",
    library: "gachchan",
    libraryExport: "default",
    libraryTarget: "umd",
    globalObject: "this",
  },

  externals: {
    // This means that your library expects a dependency named lodash to be available in the consumer's environment.
    lodash: {
      commonjs: "lodash",
      commonjs2: "lodash",
      amd: "lodash",
      root: "_",
    },
  },

  // plugins: [new ESLintPlugin({fix: true })],

  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
    ],
  },
  mode: "production",
}
