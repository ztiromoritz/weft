/* globals require, module, __dirname */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: "./src/app/app.js", // bundle's entry point
  output: {
    path: path.resolve(__dirname, 'dist'), // output directory
    filename: "main.js" // name of the generated bundle
  },
  devtool: 'source-map',
  resolve : {
    alias : {
      vue$ : 'vue/dist/vue.esm.js'
    }
  },
  plugins : [
    new HtmlWebpackPlugin({
      template: "./src/app/index.html",
      inject : "body"
    })
  ],
  devServer: {
    //contentBase: path.join(__dirname, "static"),
  },
  module: {
    rules : [
      {
        test: /\.css$/,
        loader: ["style-loader","css-loader"]
      },
      {
        test: /\.scss$/,
        loader: ["style-loader","css-loader","sass-loader"]
      },
      {
        test: /\.pug$/,
        loader: 'pug-loader'
      },
      {
          test: /\.svg$/,
          loader: 'svg-inline-loader'
      }
    ]
  }
};