"use strict";

// TODO add highlight
// https://stackoverflow.com/questions/27531860/how-to-highlight-a-certain-line-in-ace-editor

/* Helpers */
// Get contents of sketch.js without running
function readFileFromURL(url) {
	$.get(url, function(data) {
		editor.setValue(data, -1); // Replace everything
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
var program = urlVars["program"] || "sketch";
readFileFromURL("./sketches/" + program + ".rb");

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
	// var js_code = editor.getValue();
	// Get selection, otherwise get current line
	// TODO flash code on run
	var code = editor.getSelectedText();
	code = code ? code : editor.session.getLine(editor.getCursorPosition().row);

	// Use iframe's contentWindow as namespace
	var w = iframe.contentWindow;

	var result = {};

	// result.value = w.eval(code); // JavaScript
	result.returnValue = w.Opal.eval(code); // Opal/Ruby
	result.compiledCode = w.Opal.compile(code);

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
			'<script type="text/ruby" src="resources/turtle-opal.rb"></script>\n' +

			'<script type="text/javascript" src="./resources/turtle.js"></script>\n' +

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
			editor.selectAll();
			render(iframe);
			editor.clearSelection();
		}, 500);
	}

	// Export iframe to main window
	window.iframe = iframe;

}
