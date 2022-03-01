const path = require('path');
const webpack = require('webpack');
const {whenDev, whenProd} = require('@craco/craco');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtraPlugin = require('mini-css-extract-plugin');
const svgToMiniDataURI = require('mini-svg-data-uri');
const lessModifyVars = require('./src/common/css/lessVariables');

const {CDN_PREFIX, MODE} = process.env;
const whenAnalysis = (fn, defaultValue) => (MODE === 'analysis' ? fn() : defaultValue);

module.exports = {
    entry: './src/index.tsx',
    output: {
        filename: 'load.js',
        path: path.resolve(__dirname, 'build'),
        libraryTarget: 'umd',
        library: 'shoppingCart',
        umdNamedDefine: true,
        publicPath: whenProd(() => CDN_PREFIX || '', '/'),
        clean: true,
    },
    resolve: {
        extensions: ['.js', '.json', '.ts', '.tsx', '.jsx'],
        alias: {
            '@': path.resolve(__dirname, 'src/'),
            '@modules': path.resolve(__dirname, 'src/modules/'),
            '@services': path.resolve(__dirname, 'src/services/'),
        },
    },
    plugins: [
        ...whenDev(() => {
            return [
                new webpack.ProgressPlugin(),
                new HtmlWebpackPlugin({
                    template: path.resolve(__dirname, 'public/index.html'),
                    scriptLoading: 'blocking',
                    inject: 'head',
                }),
            ];
        }, []),
        ...whenAnalyzer(() => {
            return [
                new BundleAnalyzerPlugin(),
            ]
        }, []),
    ],
    module: {
        rules: [
            {
                test: /\.(jsx|tsx|ts|js)$/i,
                use: ['babel-loader'],
                exclude: /node_modules/,
            },
            {
                test: /\.css$/i,
                use: [
                    whenDev(() => 'style-loader', MiniCssExtractPlugin.loader),
                    'css-loader',
                ],
            },
            {
                test: /\.module\.less$/,
                exclude: /node_modules/,
                use: [
                    whenDev(() => 'style-loader', MiniCssExtractPlugin.loader),
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                localIdentName: whenProd(() => '[local]_[hash:base64:5]', '[path]_[local]'),
                            },
                        },
                    },
                    {
                        loader: 'less-loader',
                        options: {
                            lessOptions: {
                                javascriptEnabled: true,
                                modifyVars: lessModifyVars,
                            },
                        },
                    },
                ],
            },
            {
                test: /\.less$/i,
                exclude: /\.module\.less$/i,
                use: [
                    whenDev(() => 'style-loader', MiniCssExtractPlugin.loader),
                    'css-loader',
                    {
                        loader: 'less-loader',
                        options: {
                            lessOptions: {
                                javascriptEnabled: true,
                                modifyVars: lessModifyVars,
                            },
                        },
                    },
                ],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.svg$/i,
                type: 'asset/inline',
                generator: {
                    dataUrl: content => svgToMiniDataURI(content.toString()),
                },
            },
        ],
    },
    devServer: {
        static: path.resolve(__dirname, 'build'),
        port: 9090,
        open: true,
    },
};
