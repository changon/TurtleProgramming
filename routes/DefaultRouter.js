const HttpStatus = require('http-status-codes');
const router = require('express').Router();

const { Sketch } = require('../models');

module.exports = (app) => {
	router.get('/', (req, res) => {
		res.render('index.pug');
	})

	router.get('/iframe-sandbox', (req, res) => {
		res.render('iframe-sandbox');
	})

	app.use(router);
};
