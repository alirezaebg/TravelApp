const path = require("path");
const webpack = require("webpack");
const HtmlWebPackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const {
  CleanWebpackPlugin
} = require('clean-webpack-plugin');

module.exports = {
  entry: {
    info: './src/client/info.js',
  },
  mode: 'production',
  output: {
    libraryTarget: 'var',
    library: 'Info',
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  optimization: {
    minimizer: [new TerserPlugin({}), new OptimizeCSSAssetsPlugin({})],
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
      // {
      //   test: /\.ejs$/,
      //   use: [{
      //     loader: "ejs-webpack-loader",
      //     options: {
      //       data: {
      //         imageUrl: []
      //       },
      //       htmlmin: false
      //     }
      //   }]
      // }

    ]
  },
  plugins: [
    // new HtmlWebPackPlugin({
    //   template: "./src/client/views/travelInfo.ejs",
    //   filename: "./travelInfo.ejs",
    // }),
    new CopyPlugin({
      patterns: [{
        from: './src/client/views/travelInfo.ejs',
        to: './travelInfo.ejs',
        toType: 'file',
      }, ],
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
