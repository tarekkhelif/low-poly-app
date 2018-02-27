const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const webpack = require("webpack");

const distDir = "./dist";

module.exports = {
    entry: {
        main: [
            "babel-polyfill",
            /* "react-hot-loader/patch", */ "./src/index.jsx"
        ]
    },
    plugins: [
        new CleanWebpackPlugin([distDir]),
        new HtmlWebpackPlugin({ title: "Lowgon" }),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ["babel-loader"]
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            },
            {
                rules: [
                    {
                        test: /\.scss$/,
                        use: [
                            {
                                loader: "style-loader"
                            },
                            {
                                loader: "css-loader",
                                options: { sourceMap: true }
                            },
                            {
                                loader: "resolve-url-loader",
                                options: { sourceMap: true }
                            },
                            {
                                loader: "sass-loader",
                                options: { sourceMap: true }
                            }
                        ]
                    }
                ]
            },
            {
                test: /\.(jpg|csv)$/,
                use: ["file-loader"]
            }
            // {
            //     test: /\.(csv|tsv)$/,
            //     use: ["csv-loader"]
            // }
        ]
    },
    resolve: {
        extensions: [".js", ".jsx"]
    },
    output: {
        filename: "[name].bundle.js",
        path: path.resolve(__dirname, distDir),
        publicPath: "/"
    },
    devtool: "inline-source-map",
    devServer: {
        contentBase: distDir,
        port: 3003,
        hot: true,
        open: true,
        progress: true
    }
};
