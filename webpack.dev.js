const path = require("path");
const webpack = require("webpack");
const HtmlWebPackPlugin = require('html-webpack-plugin');
const {
  CleanWebpackPlugin
} = require('clean-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');

module.exports = [{
    entry: {
      app: './src/client/index.js',
    },
    mode: 'development',
    output: {
      libraryTarget: 'var',
      library: 'Client',
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
    module: {
      rules: [{
          test: '/\.js$/',
          exclude: /node_modules/,
          loader: "babel-loader"
        },
        {
          test: /\.scss$/,
          use: ['style-loader', 'css-loader', 'sass-loader']
        },
        {
          test: /\.(png|svg|jpg|gif)$/,
          use: [{
            loader: 'file-loader',
            options: {
              // limit: 8000, // Convert images < 8kb to base64 strings
              name: 'media/[name].[ext]'
            }
          }]
        }
      ]
    },
    plugins: [
      new HtmlWebPackPlugin({
        template: "./src/client/views/index.html",
        filename: "./index.html",
      }),
      new CleanWebpackPlugin({
        // Simulate the removal of files
        dry: true,
        // Write Logs to Console
        verbose: true,
        // Automatically remove all unused webpack assets on rebuild
        cleanStaleWebpackAssets: true,
        protectWebpackAssets: false
      }),
      new WorkboxPlugin.GenerateSW(),
    ]

  },
  {
    entry: {
      info: './src/client/info.js',
    },
    mode: 'development',
    output: {
      libraryTarget: 'var',
      library: 'Info',
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
    module: {
      rules: [{
          test: '/\.js$/',
          exclude: /node_modules/,
          loader: "babel-loader"
        },
        {
          test: /\.scss$/,
          use: ['style-loader', 'css-loader', 'sass-loader']
        },
        {
          test: /\.(png|svg|jpg|gif)$/,
          use: [{
            loader: 'file-loader',
            options: {
              // limit: 8000, // Convert images < 8kb to base64 strings
              name: 'media/[name].[ext]'
            }
          }]
        },
        {
          test: /\.ejs$/i,
          use: 'raw-loader',
        },
      ]
    },
    plugins: [
      new HtmlWebPackPlugin({
        template: "./src/client/views/travelInfo.ejs",
        filename: "./travelInfo.ejs",
      }),
      new CleanWebpackPlugin({
        // Simulate the removal of files
        dry: true,
        // Write Logs to Console
        verbose: true,
        // Automatically remove all unused webpack assets on rebuild
        cleanStaleWebpackAssets: true,
        protectWebpackAssets: false
      }),
    ]
  }
]
