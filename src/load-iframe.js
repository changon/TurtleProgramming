"use strict";

// TODO add highlight
// https://stackoverflow.com/questions/27531860/how-to-highlight-a-certain-line-in-ace-editor

/* Helpers */
// Get contents stored in localStorage
// TODO use jquery?
function readFromLocalStorage() {
	var data = localStorage.getItem("editor_contents");
	if (data) {
		_editor.setValue(data, -1); // Replace everything
		return true;
	}
	else {
		return false;
	}
}

function saveToLocalStorage() {
	console.log("Saving...")
	var data = _editor.getValue();
	localStorage.setItem("editor_contents", data);
}

// Get contents of sketch.js without running
function readFileFromURL(url) {
	$.get(url, function(data) {
		_editor.setValue(data, -1); // Replace everything
	}, "text");
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
var program = urlVars["program"]; // || "sketch";

// If a program is specified, load it
// Else, read from localStorage
if (program) {
	readFileFromURL("./sketches/" + program + ".rb");
}
else {
	readFromLocalStorage();
}

var iframe = document.querySelector("#output-iframe");
init_sandbox(iframe);

// Event listeners
// Body keydown listener
// $("body").keydown(function(event) {
document.body.addEventListener("keydown", function(event) {
	// https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/getModifierState
	window.event = event;
	var ctrlPressed = event.getModifierState("Control") || event.getModifierState("Meta");
	var key = event.key;

	if (ctrlPressed && key=="Enter") {
		render(iframe);
	}
});

/* Helper functions */
function render(iframe) {
	// TODO: Get whole text or just selected text?
	// var js_code = _editor.getValue();
	// Get selection, otherwise get current line
	// TODO flash code on run
	// var code = _editor.getSelectedText();
	var code = _editor.getValue();
	code = code ? code : _editor.session.getLine(_editor.getCursorPosition().row);

	// Use iframe's contentWindow as namespace
	var w = iframe.contentWindow;

	var result = {};

	switch (app.currentLanguage) {
	case "javascript":
		result.compiledCode = code;
		result.returnValue = w.eval(result.compiledCode); // TODO move to end
		break;
	case "ruby":
		result.compiledCode = w.Opal.compile(code);
		result.returnValue = w.eval(result.compiledCode); // TODO move to end
		break;
	case "python":
		w.Sk.pre = "output";
		w.Sk.configure({output: function(text) { console.log(text); }, read: function() {
			if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][x] === undefined)
				throw "File not found: '" + x + "'";
			return Sk.builtinFiles["files"][x];
		}});
		// (w.Sk.TurtleGraphics || (w.Sk.TurtleGraphics = {})).target = 'mycanvas';
		var myPromise = w.Sk.misceval.asyncToPromise(function() {
			return w.Sk.importMainWithBody("<stdin>", false, code, true);
		});
		myPromise.then(function(mod) {
			console.log('success');
		}, function(err) {
			console.log(err.toString());
		});
	}

	console.log("Executing code", result);
}

function init_sandbox(iframe) {
	// Probably should make sure there are no memory leaks or anything...

	// Inject some HTML into the iframe
	var html =
		'<!doctype html>\n' +
		'<html>\n' +
		'<head>\n\t\t' +
			'<meta charset="utf-8"/>\n\t' +
			'<title>Sandbox</title>\n' +
			'<link rel="stylesheet" href="./resources/iframe-style.css"/>\n' +

			'<!--p5.js-->\n' +
			'<script language="javascript" src="./resources/p5.min.js"></script>\n' +

			// '<script src="./resources/p5.gibber.min.js" type="text/javascript" charset="utf-8"></script>\n' +
			// '<script> function setup() { window["setup1"](); } function draw() { window["draw1"](); } </script>\n' +
			// '<script> var setup1 = function(){}; var draw1 = function(){}; </script>\n' +

			// TODO load opal asynchronously to not slow down page loading time
			'<!--Opal-->\n' +
			'<script type="text/javascript" src="./resources/opal.js"></script>\n' +
			'<script type="text/javascript" src="./resources/opal-parser.js"></script>\n' +
			'<script type="text/javascript" src="./resources/opal-native.js"></script>\n' +
			'<script type="text/javascript">Opal.load("opal-parser")</script>\n' +
			'<script type="text/ruby" src="./src/turtle-opal.rb"></script>\n' +

			'<!--Skulpt-->\n' +
			'<script type="text/javascript" src="http://www.skulpt.org/static/skulpt.min.js"></script>\n' +
			'<script type="text/javascript" src="http://www.skulpt.org/static/skulpt-stdlib.js"></script>\n' +
			'<script type="text/javascript" src="./src/turtle-skulpt.py"></script>\n' +

			'<script type="text/javascript" src="./src/turtle.js"></script>\n' +

		'</head>\n' +
		'<body>\n' +
		'</body>\n' +
		'</html>';

	// Write to iframe
	iframe.contentDocument.open();
	iframe.contentDocument.write(html);
	iframe.contentDocument.close();

	// Autorun after a delay (this is so hackish)
	// TODO replace with an event listener
	if (urlVars["autorun"]) {
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

// Save keybinding
_editor.commands.addCommand({
    name: "save",
    exec: function() {
		saveToLocalStorage();
	},
    bindKey: {mac: "Cmd-S", win: "Ctrl-S"}
})
