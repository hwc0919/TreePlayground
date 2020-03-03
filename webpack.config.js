// const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
    entry: [__dirname + "/src/js/main.js"],
    output: {
        path: __dirname + "/public",//打包后的文件存放的地方
        filename: "bundle.js"//打包后输出文件的文件名
    },
    watch: true,
    mode: "none",
    // plugins: [
    //     new VueLoaderPlugin()
    // ],
    // module: {
    //     rules: [
    //         {
    //             test: /.vue$/,
    //             loader: 'vue-loader'
    //         },
    //         {
    //             test: /.css$/,
    //             use: [
    //                 'style-loader',
    //                 'css-loader'
    //             ]
    //         }
    //     ]
    // }
}