const VueLoaderPlugin = require('vue-loader/lib/plugin');
// const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: [__dirname + "/src/main.js"],
    output: {
        path: __dirname + "/dist",//打包后的文件存放的地方
        filename: "bundle.js"//打包后输出文件的文件名
    },
    watch: true,
    mode: "none",
    plugins: [
        new VueLoaderPlugin(),
        // new HtmlWebpackPlugin()
    ],
    module: {
        rules: [
            {
                test: /.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    }
}