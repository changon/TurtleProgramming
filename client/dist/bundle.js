/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/* RequireJS config */
// https://github.com/ajaxorg/ace/issues/1017
/*
requirejs.config({
	baseUrl: window.location.protocol + "//" + window.location.host
		+ window.location.pathname.split("/").slice(0, -1).join("/"),

	paths: {
		'ace': [
			'https://cdnjs.cloudflare.com/ajax/libs/ace/1.2.5/ace.js',
			'https://cdnjs.cloudflare.com/ajax/libs/ace/1.2.6/ext-language_tools.js'
		]
	}
});
*/

/* Load Ace editor */
// var ace = require(['ace/ace']);

var _editor = ace.edit('editor');
// Options: https://github.com/ajaxorg/ace/wiki/Embedding-API
_editor.setOptions({
	// editor.renderer
	theme: 'ace/theme/monokai',
	enableBasicAutocompletion: true,
	enableLiveAutocompletion: false,
	enableSnippets: true
});

// TODO
_editor.getSession().setOptions({
	mode: 'ace/mode/' + defaultLanguage
});

// Snippets
// var snippetManager = require('ace/snippets').snippetManager;
// var snippets = [
// 	'snippet hello 	\n\t puts "it works!"'
// ];
// snippets.forEach((snippet) => {
// 	snippetManager.register(snippetManager.parseSnippetFile(snippet)/*, 'ruby'*/);
// );

/* Window event listeners */
// Resize listener
window.addEventListener('resize', function() {
	_editor.resize();
	// TODO: resize p5 canvas as well
});

/* Keybindings */
// Save keybinding
_editor.commands.addCommand({
    name: 'save',
    exec: function() {
		saveToLocalStorage();
	},
    bindKey: { mac: 'Cmd-S', win: 'Ctrl-S' }
});

// Eval keybinding
_editor.commands.addCommand({
    name: 'eval',
    exec: function() {
		evalSelectionOrLine(iframe);
	},
    bindKey: { mac: 'Cmd-Enter', win: 'Ctrl-Enter' }
});

// Load iframe
var iframe = document.querySelector('#output-iframe');
init_sandbox(iframe);

// Load Vue viewmodels
var _toolbar = new Vue({
	el: '#toolbar',
	data: {
		supportedLanguages: supportedLanguages,
		currentLanguage: defaultLanguage,
		commandCatalog: commandCatalog,
		programList: programList
	},
	computed: {
		t: function() {
			// return iframe.contentWindow.t;
			return iframe.contentWindow.proxy;
		}
	},
	methods: {
		updateLanguage: function() {
			var lang = this.currentLanguage;
			console.log('Language changed to: ' + lang);
			_editor.getSession().setOption('mode', 'ace/mode/' + lang);
		},
		insertCode: function(code) {
			// Since we don't have snippets implemented yet,
			// just strip out the dollar signs
			var sanitized = code.split(/\$[0-9]/).join('');
			_editor.insert(sanitized);
		},
		loadSketch: function(sketch) {
			var url = './sketches/' + sketch.fileName;
			readFileFromURL(url);
			if (sketch.language) {
				this.currentLanguage = sketch.language;
				this.updateLanguage();
			}
			if (sketch.autorun) {
				evalAll();
				console.log('Autorunning');
			}
			console.log('Load sketch ' + sketch.name + ' from ' + url);
		}
	},
	// TODO this should be wrapped in vm for ace, and run after ace loads
	mounted: function() {
		// TODO rewrite using Backbone.router
		var urlVars = getURLVars();

		// If a program is specified, load it
		// Else, read from localStorage
		var program = urlVars['program']; // || 'sketch';
		if (program) {
			var url = './sketches/' + program;
			readFileFromURL(url);
			console.log('Read sketch from ' + url);
		}
		else {
			readFromLocalStorage();
		}

		// TODO: merge with loadSketch()
		// If a language is specified, check to make sure
		// it is supported, and load it
		var language = urlVars['language'];
		if (language && language in supportedLanguages) {
			console.log('Using language ' + language);
			this.currentLanguage = language;
		}

		this.updateLanguage();

		// TODO: merge with loadSketch()
		// Autorun after a delay (this is so hackish)
		// TODO replace with an event listener
		if (urlVars['autorun']) {
			console.log('Autorunning');
			setTimeout(function() {
				evalAll();
			}, 2000);
		}
	}
});


// TODO add highlight
// https://stackoverflow.com/questions/27531860/how-to-highlight-a-certain-line-in-ace-editor

// Save timer
window.setInterval(saveToLocalStorage, 30000);

/*
TODO mousetrap?
https://craig.is/killing/mice
*/

// TODO Fulscreen?


/***/ })
/******/ ]);