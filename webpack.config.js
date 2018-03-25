/* globals require, module, __dirname */
const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: "./src/app/app.js", // bundle's entry point
    output: {
        path: path.resolve(__dirname, 'dist/app'), // output directory
        filename: "main.js", // name of the generated bundle
       // publicPath: "dist/app"
    },
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
        })
        //new CopyWebpackPlugin([ { from: './dist/template', to: './app/template' } ])
    ],
    devServer: {

        /*contentBase: 'dist/app/template/', //disk location
        watchContentBase: true,
        setup(app) {
            app.use('dist/app/template/', express.static('/template/'));
        }*/

        contentBase: path.join(__dirname, "dist/app"),
        //openPage: ''
        // proxy: {
        //    '/template': {
        //        target: 'localhost:8888',
        //        secure: false
        //    }
        //}
    }
    ,
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
                test: /\.pug$/,
                loader: 'pug-loader'
            },
            {
                test: /\.svg$/,
                loader: 'svg-inline-loader'
            }
        ]
    }
}
;