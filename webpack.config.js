const webpack = require('webpack');
const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = (env, argv) => {
  let config = {
    entry: ['babel-polyfill', path.resolve(__dirname, 'src', 'index.js')],
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist', 'js')
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)?$/,
          include: [
            path.resolve(__dirname, 'src')
          ],
          exclude: [
            path.resolve(__dirname, 'node_modules')
          ],
          loader: 'babel-loader'
        },
        {
          test: /\.(sass|css)?$/,
          use: [
            { loader: 'style-loader' },
            { loader: 'css-loader' },
            { loader: 'sass-loader' }
          ]
        }
      ]
    },
    resolve: {
      alias: {
        src: path.resolve(__dirname, 'src')
      }
    },
    plugins: [
      new webpack.ContextReplacementPlugin(
        /moment[\/\\]locale$/,
        /en/
      ),
      new BundleAnalyzerPlugin()
    ]
  };

  if (argv['mode'] === 'production') {
    config.optimization = {
      minimize: true
    };
    config.plugins.pop();
  }

  return config;
};