const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
	entry: {
		app: ['babel-polyfill', './src/index.js']
	},
	output: {
		path: path.resolve(__dirname, './dist'),
		filename: 'app.bundle.js'
	},
	module: {
		rules: [
		{
			test: /\.js?$/,
			exclude: /node_modules/,
			loader: 'babel-loader',
			query: {
				presets: ['env', 'stage-0']
			}
		}, 
		{
			test: /\.s[a|c]ss?$/, 
			use: [
				MiniCssExtractPlugin.loader,
        {
          loader: 'css-loader',
          options: {
            minimize: true
          }
        },
				{
          loader: 'postcss-loader',
          options: {
            plugins: function () {
              return [
                require('autoprefixer')
              ];
            }
          }
        },
				'sass-loader'
			]
		},
    {
      test: /\.(jpe?g|png|gif|svg)$/,
      include: [
        path.resolve(__dirname, 'src/assets/')
      ],
      use: [
        {
          loader: 'file-loader', 
          options: { 
            name: '[name].[ext]', 
            outputPath: './assets/' 
          } 
        }
      ]
    },
    {
      test: /.(js)$/,
      include: [
        path.resolve(__dirname, 'src/assets/js/')
      ],
      use: [
        {
          loader: 'file-loader', 
          options: { 
            name: '[name].[ext]', 
            outputPath: './assets/js/' 
          } 
        }
      ]
    },
    {
      test: /.(css)?$/,
      include: [
        path.resolve(__dirname, 'src/assets/css/')
      ],
      use: {
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: './assets/css/'
        }
      }
    }]
	},
	plugins: [
    new CleanWebpackPlugin(['dist']),
		new HtmlWebpackPlugin({
			hash: true,
			template: './src/index.html'
		}),
		new MiniCssExtractPlugin({
      filename: 'styles.bundle.css'
    })
	],
  devServer: {
    port: 3000
  }
}