const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
    entry: [__dirname + "/src/main.js"],
    output: {
        path: __dirname + "/docs",  // for github-page
        filename: "bundle.js"
    },
    watch: true,
    // mode: "development",
    mode: "production",
    plugins: [
        new VueLoaderPlugin(),
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