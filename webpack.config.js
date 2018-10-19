/* globals require, module, __dirname */
const path = require('path');
const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: "./src/app/app.js", // bundle's entry point
    output: {
        path: path.resolve(__dirname, 'dist/app'), // output directory
        filename: "main.js", // name of the generated bundle
    },
    mode : 'development',
    devtool: 'source-map',
    resolve: {
        alias: {
            vue$: 'vue/dist/vue.esm.js'
        }
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/app/index.html",
            inject: "body"
        }),
        new webpack.DefinePlugin({
            TEMPLATE_URL: JSON.stringify(process.env.TEMPLATE_URL)
        })
    ],
    devServer: {
        contentBase: path.join(__dirname, "dist/app")
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                loader: ["style-loader", "css-loader"]
            },
            {
                test: /\.scss$/,
                loader: ["style-loader", "css-loader", "sass-loader"]
            },
            {
                test: /\.svg$/,
                loader: 'svg-inline-loader'
            }
        ]
    }
}
;