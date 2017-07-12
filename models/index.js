const fs = require('fs');
const path = require('path');
const basename = path.basename(module.filename);
const config = require('../config');
const models = {};

// Setup Mongoose and connect to MongoDB
const mongoose = require('mongoose');
mongoose.Promise = global.Promise; // Use ES6 Promises
mongoose.connect(config.mongoURI, {
	useMongoClient: true
});

fs
	.readdirSync(__dirname)
	.filter((file) => {
		return (file.indexOf('.') !== 0) && (file !== basename) && (file.match(/\.js$/));
	})
	.forEach((file) => {
		let name = file.replace('.js', '');
		models[name] = require(path.join(__dirname, name));
	});

module.exports = models;
