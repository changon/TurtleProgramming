const fs = require('fs');
const path = require('path');
const basename = path.basename(module.filename);
const controllers = {};

fs
	.readdirSync(__dirname)
	.filter((file) => {
		return (file.indexOf('.') !== 0) && (file !== basename) && (file.match(/\.js$/));
	})
	.forEach((file) => {
		let name = file.replace('.js', '');
		controllers[name] = require(path.join(__dirname, name));
	});

module.exports = controllers;
