/* globals require, module, __dirname */
const path = require('path');
const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');

module.exports = {
    entry: {
        app :  "./src/app/app.js",
        chatter : "./src/template/index.js"
    },
    output: {
        library: 'weft_[name]',
        libraryTarget: 'umd',
        path: path.resolve(__dirname, 'dist/app'), // output directory
        filename: "[name].js", // name of the generated bundle
    },
    mode : 'development',
    devtool: 'source-map',
    resolve: {
        alias: {
            vue$: 'vue/dist/vue.esm.js',
            Assets: path.resolve(__dirname, 'src/common/assets/'),
            Common: path.resolve(__dirname, 'src/common/js/'),
            Components : path.resolve(__dirname, 'src/common/js/components/')
        }
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename : "index.html",
            template: "./src/app/index.html",
            inject: "body",
            chunks : [ 'app']
        }),
        new HtmlWebpackPlugin({
            filename : "template.html",
            template: "./src/template/index.html",
            chunks: ['chatter'],
            inject: "body",
            inlineSource: '.(js|css)$'
        }),
        new HtmlWebpackInlineSourcePlugin(),
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