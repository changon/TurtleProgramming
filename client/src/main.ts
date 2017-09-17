import * as ace from 'brace';
import * as Vue from 'vue';

import * as models from './models';
import * as helpers from './helpers';

declare function require(path: string): any;

/* Load Ace editor */
// Load languages
for (let language of Object.keys(models.supportedLanguages)) {
	require('brace/mode/' + language);
	require('brace/snippets/' + language);
}
import 'brace/theme/monokai';
import 'brace/ext/language_tools';
import 'brace/snippets/text'; // not sure why this is needed
ace.acequire('ace/ext/language_tools');

// Initialize editor
export const _editor = ace.edit('editor');
// Options: https://github.com/ajaxorg/ace/wiki/Embedding-API
_editor.setOptions({
	// editor.renderer
	theme: 'ace/theme/monokai',
	enableBasicAutocompletion: true,
	enableLiveAutocompletion: false,
	enableSnippets: true
});

// This is to remove following warning message on console:
// Automatically scrolling cursor into view after selection change this will be disabled in the next version
// set editor.$blockScrolling = Infinity to disable this message
_editor.$blockScrolling = Infinity;

// TODO
_editor.getSession()
	.setMode('ace/mode/' + models.defaultLanguage);

// Snippets
// const snippetManager = require('ace/snippets').snippetManager;
// const snippets = [
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
		helpers.saveToLocalStorage(_editor);
	},
	bindKey: { mac: 'Cmd-S', win: 'Ctrl-S' }
});

// Eval keybinding
_editor.commands.addCommand({
	name: 'eval',
	exec: function() {
		helpers.evalSelectionOrLine(_editor, iframe);
	},
	bindKey: { mac: 'Cmd-Enter', win: 'Ctrl-Enter' }
});

// Load iframe
const iframe: HTMLIFrameElement = document.querySelector('#output-iframe') as HTMLIFrameElement;
helpers.init_sandbox(iframe);

// Load Vue viewmodels
export const _toolbar = new Vue({
	el: '#toolbar',
	data: {
		supportedLanguages: models.supportedLanguages,
		currentLanguage: models.defaultLanguage,
		commandCatalog: models.commandCatalog,
		programList: models.programList
	},
	computed: {
		t: function() {
			// return iframe.contentWindow['t'];
			return iframe.contentWindow['proxy'];
		}
	},
	methods: {
		updateLanguage: function() {
			const lang = (this as any).currentLanguage;
			console.log('Language changed to: ' + lang);
			_editor.getSession().setMode('ace/mode/' + lang);
		},
		insertCode: function(code) {
			// Since we don't have snippets implemented yet,
			// just strip out the dollar signs
			const sanitized = code.split(/\$[0-9]/).join('');
			_editor.insert(sanitized);
		},
		loadSketch: function(sketch) {
			const url = '/sketches/' + sketch.fileName;
			helpers.readFileFromURL(_editor, url);
			if (sketch.language) {
				(this as any).currentLanguage = sketch.language;
				(this as any).updateLanguage();
			}
			if (sketch.autorun) {
				helpers.evalAll(_editor, iframe);
				console.log('Autorunning');
			}
			console.log('Load sketch ' + sketch.name + ' from ' + url);
		}
	},
	// TODO this should be wrapped in vm for ace, and run after ace loads
	mounted: function() {
		// TODO rewrite using Backbone.router
		const urlVars = helpers.getURLVars();

		// If a program is specified, load it
		// Else, read from localStorage
		const program = urlVars['program']; // || 'sketch';
		if (program) {
			const url = '/sketches/' + program;
			helpers.readFileFromURL(_editor, url);
			console.log('Read sketch from ' + url);
		}
		else {
			helpers.readFromLocalStorage(_editor);
		}

		// TODO: merge with loadSketch()
		// If a language is specified, check to make sure
		// it is supported, and load it
		const language = urlVars['language'];
		if (language && language in models.supportedLanguages) {
			console.log('Using language ' + language);
			(this as any).currentLanguage = language;
		}

		(this as any).updateLanguage();

		// TODO: merge with loadSketch()
		// Autorun after a delay (this is so hackish)
		// TODO replace with an event listener
		if (urlVars['autorun']) {
			console.log('Autorunning');
			setTimeout(function() {
				helpers.evalAll(_editor, iframe);
			}, 2000);
		}
	}
});

// TODO don't use globals
window['_toolbar'] = _toolbar;


// TODO add highlight
// https://stackoverflow.com/questions/27531860/how-to-highlight-a-certain-line-in-ace-editor

// Save timer
window.setInterval(helpers.saveToLocalStorage, 30000);

/*
TODO mousetrap?
https://craig.is/killing/mice
*/

// TODO Fulscreen?
