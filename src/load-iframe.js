'use strict';

// TODO add highlight
// https://stackoverflow.com/questions/27531860/how-to-highlight-a-certain-line-in-ace-editor

/* Helpers */
// Get contents stored in localStorage
// TODO use jquery?
function readFromLocalStorage() {
	var data = localStorage.getItem('editor_contents');
	if (data) {
		_editor.setValue(data, -1); // Replace everything
		return true;
	}
	else {
		return false;
	}
}

function saveToLocalStorage() {
	console.log('Saving...')
	var data = _editor.getValue();
	localStorage.setItem('editor_contents', data);
}

// Get contents of sketch.js without running
function readFileFromURL(url) {
	$.get(url, function(data) {
		_editor.setValue(data, -1); // Replace everything
	}, 'text');
}

// Read a page's GET URL variables and return them as an associative array.
// From http://stackoverflow.com/a/4656873
function getURLVars() {
	var vars = [], hash;
	var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
	for(var i = 0; i < hashes.length; i++) {
		hash = hashes[i].split('=');
		vars.push(hash[0]);
		vars[hash[0]] = hash[1];
	}
	return vars;
}

// TODO this is ugly
var urlVars = getURLVars();
var program = urlVars['program']; // || 'sketch';

// If a program is specified, load it
// Else, read from localStorage
if (program) {
	readFileFromURL('./sketches/' + program + '.rb');
}
else {
	readFromLocalStorage();
}

var iframe = document.querySelector('#output-iframe');
init_sandbox(iframe);

/* Helper functions */
function evalSelectionOrLine(iframe) {
	// Get selection, otherwise get current line
	// TODO flash code on run
	var code = _editor.getSelectedText();
	code = code ? code : _editor.session.getLine(_editor.getCursorPosition().row);

	render(iframe, code);
}

function evalAll() {
	// TODO: flash code
	var code = _editor.getValue();
	render(iframe, code);
}

function render(iframe, code) {
	// Use iframe's contentWindow as namespace
	var w = iframe.contentWindow;

	var result = {};

	switch (_toolbar.currentLanguage) {
	case 'javascript':
		result.compiledCode = code;
		result.returnValue = w.eval(result.compiledCode);
		break;
	case 'ruby':
		result.compiledCode = w.Opal.compile(code);
		result.returnValue = w.eval(result.compiledCode);
		break;
	case 'python':
		var myPromise = w.Sk.misceval.asyncToPromise(function() {
			return w.Sk.importMainWithBody('<stdin>', false, code, true);
		});
		myPromise.then(function(mod) {
			result.compiledCode = mod.$js;
			result.returnValue = mod.$d;
		}, function(err) {
			console.err(err.toString());
		});
		break;
	}

	console.log('Executing code', result);
}

function init_sandbox(iframe) {
	// Probably should make sure there are no memory leaks or anything...

	// Inject some HTML into the iframe
	// var html = ...

	// Write to iframe
	// iframe.contentDocument.open();
	// iframe.contentDocument.write(html);
	// iframe.contentDocument.close();
	
	// Load iframe
	iframe.src = './iframe-sandbox.html';

	// Autorun after a delay (this is so hackish)
	// TODO replace with an event listener
	if (urlVars['autorun']) {
		iframe.contentWindow.setTimeout(function() {
			_editor.selectAll();
			render(iframe);
			_editor.clearSelection();
		}, 500);
	}

	// Export iframe to main window
	window.iframe = iframe;

}

// Save timer
window.setInterval(saveToLocalStorage, 30000);

/* Event listeners */
// Save keybinding
_editor.commands.addCommand({
    name: 'save',
    exec: function() {
		saveToLocalStorage();
	},
    bindKey: {mac: 'Cmd-S', win: 'Ctrl-S'}
})

// Eval keybinding
// $('body').keydown(function(event) {
document.body.addEventListener('keydown', function(event) {
	// https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/getModifierState
	window.event = event;
	var ctrlPressed = event.getModifierState('Control') || event.getModifierState('Meta');
	var key = event.key;

	if (ctrlPressed && key=='Enter') {
		evalSelectionOrLine(iframe);
	}
});
