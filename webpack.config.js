const HtmlWebPackPlugin = require("html-webpack-plugin")
const webpack = require('webpack');

module.exports = {
	watch: true,
	devServer: {
        index: '../index.html',
        hot: true,
    },
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader"
				}
			},
			{
				test: /\.html$/,
				use: [
				  {
					loader: "html-loader"
				  }
				]
			}
		]
	},
	plugins: [
		new HtmlWebPackPlugin({
			template: "./src/index.html",
			filename: "../index.html"
		}),
		new webpack.NamedModulesPlugin(),
    	new webpack.HotModuleReplacementPlugin()
	]
}
