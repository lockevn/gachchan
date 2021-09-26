const path = require("path")

// const ESLintPlugin = require('eslint-webpack-plugin');

// Build the lib using 1.3 in this https://dev.to/riversun/recipes-on-how-to-create-a-library-that-supports-both-browser-and-node-js-201m#(1-3)
module.exports = {
  entry: path.resolve(__dirname, "src/index.ts"),

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.js",
    library: "MyLibrary",
    libraryExport: "default",
    libraryTarget: "umd",
    globalObject: "this",
  },

  // plugins: [new ESLintPlugin({fix: true })],
  // Enable sourcemaps for debugging webpack's output.
  devtool: "source-map",
  // resolve: {
  //   // Add '.ts' and '.tsx' as resolvable extensions.
  //   extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"],
  // },

  module: {
    rules: [
      // All files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'.
      { test: /\.tsx?$/, loader: "ts-loader" },
      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      { test: /\.js$/, loader: "source-map-loader" },

      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
    ],
  },
  mode: "production",
}
