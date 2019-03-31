const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {

    mode: "development",
    entry: './src/app.js',
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "stylesheet.css",
            chunkFilename: "[id].css"
        })
    ],
    module: {
        rules: [{
                test: /\.(png|jpg)$/,
                use: [
                    'file-loader'
                ]
            },
            {
                test: /\.(woff|woff2)$/,
                use: [
                    "file-loader?name=fonts/[name].[ext]"
                ]
            },
            {
                test: /\.css$/,
                use: [{
                        loader: MiniCssExtractPlugin.loader,

                    },
                    "css-loader"
                ]
            }
        ]
    }
};
