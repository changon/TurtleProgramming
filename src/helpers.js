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
	case 'coffeescript':
		result.compiledCode = w.CoffeeScript.compile(code);
		// Strip out the first and last lines, so that it is no longer wrapped in a closure
		result.compiledCode = result.compiledCode.split('\n').slice(1,-2).join('\n'); // two newlines at the end
		result.returnValue = w.eval(result.compiledCode);
		break;
	case 'ruby':
		result.compiledCode = w.Opal.compile(code);
		result.returnValue = w.eval(result.compiledCode);
		break;
	case 'python':
		var myPromise = w.Sk.misceval.asyncToPromise(function() {
			return w.Sk.importMainWithBody('repl', false, code, true);
		});
		myPromise.then(function(mod) {
			result.compiledCode = mod.$js;
			result.returnValue = mod.$d;
		}, function(err) {
			console.error(err.toString());
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
	// iframe.src = './iframe-sandbox.html';

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
