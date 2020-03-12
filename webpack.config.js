const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
    entry: {
        "bundle": __dirname + "/src/app.js",
        "style": __dirname + "/src/style.js"
    },
    output: {
        path: __dirname + "/docs",  // for github-page
        filename: "[name].js"
    },
    mode: "none",
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