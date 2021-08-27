const path = require('path');
const webpack = require('webpack');
const {whenDev, whenProd} = require('@craco/craco');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const {CDN_PREFIX} = process.env;

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
    ],
    module: {
        rules: [
            {
                test: /\.(jsx|tsx)$/i,
                use: ['babel-loader'],
                exclude: /node_modules/,
            },
            {
                test: /\.css$/i,
                use: [
                    'style-loader',
                    'css-loader',
                ],
            },
            {
                test: /\.module\.less$/,
                exclude: /node_modules/,
                use: ['style-loader', {
                    loader: 'css-loader',
                    options: {
                        modules: {
                            localIdentName: whenProd(() => '[local]_[hash:base64:5]', '[path]_[local]'),
                        },
                    },
                }, 'less-loader'],
            },
            {
                test: /\.less$/i,
                exclude: /(\.module\.less$)|(node_modules)/i,
                use: [
                    'style-loader',
                    'css-loader',
                    'less-loader',
                ],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
            ...whenDev(() => [
                {
                    test: /.html$/i,
                    loader: 'html-loader',
                },
            ], []),
        ],
    },
    devServer: {
        static: path.resolve(__dirname, 'build'),
        port: 9090,
        open: true,
    },
};
