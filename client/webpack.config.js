const path = require('path');

module.exports = {
	entry: {
		"main": "./src/main.ts",
		"turtle": "./src/turtle.ts",
	},
	output: {
		path: path.join(__dirname, '/dist'),
		filename: "[name].bundle.js",
		publicPath: "/dist",
		library: "[name]"
	},

	externals: {
		"jquery": "$",
		"vue": "Vue",
		"bluebird": "Promise"
	},

	// Enable sourcemaps for debugging webpack's output.
	devtool: "source-map",

	resolve: {
		// Add '.ts' and '.tsx' as resolvable extensions.
		extensions: [".ts", ".tsx", ".js", ".json"]
	},

	module: {
		rules: [
			// Typescript
			{ test: /\.tsx?$/, loader: "awesome-typescript-loader" },

			// All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
			{ enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
		]

	}
};
