const path = require('path');
	module.exports = {
	    entry: './src/app.js',
	    output: {
	        filename: 'bundle.js',
	        path: path.join(__dirname, 'public')
	    },
	    module: {
	        rules: [{
	            loader: 'babel-loader',
	            resolve: {
	                extensions: ['.js', '.jsx', '.ts', '.tsx']
	            },
	            exclude: /node_modules/
	        }]
	    }
	};