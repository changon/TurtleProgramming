import * as ace from 'brace';

// TODO don't use globals
declare const _toolbar: any;

// TODO replace jquery with axios, since we only use it for AJAX calls
import * as $ from 'jquery';

interface RenderResult {
	compiledCode: string;
	returnValue: string;
}

// Get contents stored in localStorage
// TODO use jquery?
export function readFromLocalStorage(_editor: ace.Editor): boolean {
	const data = localStorage.getItem('editor_contents');
	if (data) {
		_editor.setValue(data, -1); // Replace everything
		return true;
	}
	else {
		return false;
	}
}

export function saveToLocalStorage(_editor: ace.Editor) {
	console.log('Saving...')
	const data = _editor.getValue();
	localStorage.setItem('editor_contents', data);
}

// Get contents of sketch.js without running
export function readFileFromURL(_editor: ace.Editor, url) {
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

export function evalSelectionOrLine(_editor: ace.Editor, iframe: HTMLIFrameElement) {
	// Get selection, otherwise get current line
	// TODO flash code on run
	let code = (_editor as any).getSelectedText();
	code = code ? code : _editor.session.getLine(_editor.getCursorPosition().row);

	render(iframe, code);
}

export function evalAll(_editor: ace.Editor, iframe: HTMLIFrameElement) {
	// TODO: flash code
	const code = _editor.getValue();
	render(iframe, code);
}

export function render(iframe: HTMLIFrameElement, code) {
	// Use iframe's contentWindow as namespace
	const w: any = iframe.contentWindow;

	let result: RenderResult;

	switch (_toolbar.currentLanguage) {
	case 'javascript': {
		// Currently JavaScript is run as is, without sanitization or preprocessing with Babel or anything
		result = {
			compiledCode: code,
			returnValue: w.eval(code)
		};
		break;
	}
	case 'coffee': {
		let compiledCode = w.CoffeeScript.compile(code);
		// Strip out the first and last lines, so that it is no longer wrapped in a closure
		compiledCode = compiledCode.split('\n').slice(1,-2).join('\n'); // two newlines at the end
		let returnValue = w.eval(compiledCode);
		result = { compiledCode, returnValue };
		break;
	}
	case 'ruby': {
		let compiledCode = w.Opal.compile(code);
		let returnValue = w.eval(compiledCode);
		result = { compiledCode, returnValue };
		break;
	}
	case 'python': {
		const myPromise = w.Sk.misceval.asyncToPromise(function() {
			return w.Sk.importMainWithBody('repl', false, code, true);
		});
		myPromise.then(function(mod) {
			result = {
				compiledCode: mod.$js,
				returnValue: mod.$d
			};
		}, function(err) {
			console.error(err.toString());
		});
		break;
	}
	case 'lua': {
		let compiledCode = w.starlight.parser.parseToString(code);
		let returnValue = w.starlight.parser.parse(code)();
		result = { compiledCode, returnValue };
		// console.log(result.compiledCode);
		break;
	}
	}

	console.log('Executing code', result);
}

export function init_sandbox(iframe: HTMLIFrameElement) {
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
