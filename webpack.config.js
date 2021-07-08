const path = require('path')
const webpack = require('webpack')
const autoprefixer = require('autoprefixer')
const HTMLPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const TerserPlugin = require("terser-webpack-plugin")
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyPlugin = require("copy-webpack-plugin");
const sharp = require('sharp')

// const webpackDevServer = require('webpack-dev-server')

const isDev = process.env.NODE_ENV === 'development'
const isProd = !isDev
module.exports = {
  entry: [/* '@babel/polyfill', */ './src/index.js'],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),//второе - куда

    // publicPath: path.resolve(__dirname, '/build/')
    // environment: {
    //   arrowFunction: false
    // },
  },
  target: process.env.NODE_ENV === "development" ? "web" : "browserslist",
  devtool: isProd ? 'source-map' : 'eval-cheap-source-map',
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    watchContentBase: true,
    host: '192.168.0.110',
    inline: true,
    port: 9000
    // hot: true
  },
  plugins: [

    new HTMLPlugin({
      filename: 'index.html',
      template: './src/index.html',
      minify: {
        collapseWhitespace: true,
        keepClosingSlash: true,
        removeComments: true,
        removeRedundantAttributes: false,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true
      }
    }),
    new MiniCssExtractPlugin({
      filename: 'style.css'
    }),
    autoprefixer,
    new CopyPlugin({
      patterns: [
        //webp optimization
        {
          from: "src/images/*.webp",
          to: "images/[name][ext]",
          noErrorOnMissing: true,
          transform(content) {
            return sharp(content)
              // .webp({ reductionEffort: 0 })
              .toBuffer()
          }
        },
        //png optimization

        {
          from: "src/images/*.png",
          to: "images/[name][ext]",
          noErrorOnMissing: true,
          transform(content, absoluteFrom) {
            const name = absoluteFrom.split('\\').pop().split('.')[0]
            sharp(content)
              .webp()
              .toFile(`dist/images/${name}.webp`)

            return sharp(content)
              .png({ palette: true })
              .toBuffer()
          }
        },
        //jpg optimization
        {
          from: "src/images/*.jpg",
          to: "images/[name][ext]",
          noErrorOnMissing: true,
          transform(content, absoluteFrom) {

            const name = absoluteFrom.split('\\').pop().split('.')[0]
            sharp(content)
              .webp({ quality: 70 })
              .toFile(`dist/images/${name}.webp`)

            return sharp(content)
              .jpeg({ mozjpeg: true })
              .toBuffer()
          }
        },
      ],
      options: {
        concurrency: 100,
      },
    })
  ],
  resolve: {
    extensions: ['.js', '.ts']
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader']//rtl: импорт, после стили идут в отдельный файл
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader']//rtl: импорт, после стили идут в отдельный файл
      },
      {
        test: /\.(js|ts|jsx|tsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'thread-loader'
          },
          {
            loader: 'babel-loader',
          },
        ]
      },
      // {
      //   test: /\.(jsx|tsx)$/,
      //   exclude: /node_modules/,
      //   use:
      //     [{
      //       loader: 'thread-loader'
      //     },
      //     {
      //       loader: 'babel-loader'
      //     }
      //     ]

      // }
    ]
  },
  optimization: {
    // minimize: true,
    minimizer: [new CssMinimizerPlugin(), new TerserPlugin(
      {
        terserOptions: {
          format: {
            comments: false,
          },
        },
        // parallel: true,
        extractComments: false,
      }
    )],
  },
  //target: 'web',
}
