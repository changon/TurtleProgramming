module.exports = {
	entry: {
		"main.bundle": "./src/main.ts",
		"turtle.bundle": "./src/turtle.ts",
	},
	output: {
		path: __dirname + '/dist',
		filename: "[name].js",
		publicPath: "/dist"
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
