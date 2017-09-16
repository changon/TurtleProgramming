import * as brace from 'brace';

declare const _editor: brace.Editor;
declare const iframe: HTMLIFrameElement;
declare const _toolbar: any;
declare const $: any;

interface RenderResult {
	compiledCode: string;
	returnValue: string;
}

// Get contents stored in localStorage
// TODO use jquery?
export function readFromLocalStorage(): boolean {
	const data = localStorage.getItem('editor_contents');
	if (data) {
		_editor.setValue(data, -1); // Replace everything
		return true;
	}
	else {
		return false;
	}
}

export function saveToLocalStorage() {
	console.log('Saving...')
	const data = _editor.getValue();
	localStorage.setItem('editor_contents', data);
}

// Get contents of sketch.js without running
export function readFileFromURL(url) {
	$.get(url, function(data) {
		_editor.setValue(data, -1); // Replace everything
	}, 'text');
}

// Read a page's GET URL variables and return them as an associative array.
// From http://stackoverflow.com/a/4656873
export function getURLVars() {
	let vars = [];
	let hash;
	const hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
	for(let i = 0; i < hashes.length; i++) {
		hash = hashes[i].split('=');
		vars.push(hash[0]);
		vars[hash[0]] = hash[1];
	}
	return vars;
}

export function evalSelectionOrLine(iframe) {
	// Get selection, otherwise get current line
	// TODO flash code on run
	let code = (_editor as any).getSelectedText();
	code = code ? code : _editor.session.getLine(_editor.getCursorPosition().row);

	render(iframe, code);
}

export function evalAll() {
	// TODO: flash code
	const code = _editor.getValue();
	render(iframe, code);
}

export function render(iframe, code) {
	// Use iframe's contentWindow as namespace
	const w = iframe.contentWindow;

	let result: RenderResult;

	switch (_toolbar.currentLanguage) {
	case 'javascript':
		result.compiledCode = code;
		result.returnValue = w.eval(result.compiledCode);
		break;
	case 'coffee':
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
		const myPromise = w.Sk.misceval.asyncToPromise(function() {
			return w.Sk.importMainWithBody('repl', false, code, true);
		});
		myPromise.then(function(mod) {
			result.compiledCode = mod.$js;
			result.returnValue = mod.$d;
		}, function(err) {
			console.error(err.toString());
		});
		break;
	case 'lua':
		result.compiledCode = w.starlight.parser.parseToString(code);
		console.log(result.compiledCode);
		result.returnValue = w.starlight.parser.parse(code)();
		break;
	}

	console.log('Executing code', result);
}

export function init_sandbox(iframe) {
	// Probably should make sure there are no memory leaks or anything...

	// Inject some HTML into the iframe
	// let html = ...

	// Write to iframe
	// iframe.contentDocument.open();
	// iframe.contentDocument.write(html);
	// iframe.contentDocument.close();
	
	// Load iframe
	// iframe.src = './iframe-sandbox.html';

	// Export iframe's contentWindow to main window
	window['w'] = iframe.contentWindow;

}
