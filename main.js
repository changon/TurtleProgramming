"use strict";

// Get contentsof sketch.js without running
// function readFileFromURL(url)
var url = "sketch.js";
$.get(url, function(data) {
	editor.setValue(data);
}, "text");
// });
editor.clearSelection();

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
		console.log("Executing code");
		render(iframe);
	}
});

/* Helper functions */
function render(iframe) {
	// TODO: Get whole text or just selected text?
	// var js_code = editor.getValue();
	// Get selection, otherwise get current line
	// TODO flash
	var js_code = editor.getSelectedText();
	js_code = js_code ? js_code : editor.session.getLine(editor.getCursorPosition().row);

	// Use iframe's contentWindow as namespace
	var w = iframe.contentWindow;
	w.eval(js_code);
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
			'<script language="javascript" src="./resources/p5.min.js"></script>\n' +
			// '<script src="./resources/p5.gibber.min.js" type="text/javascript" charset="utf-8"></script>\n' +
			// '<script> function setup() { window["setup1"](); } function draw() { window["draw1"](); } </script>\n' +
			// '<script> var setup1 = function(){}; var draw1 = function(){}; </script>\n' +
			'<script src="./resources/turtle.js"></script>\n' +
		'</head>\n' +
		'<body>\n' +
		'</body>\n' +
		'</html>';

	// Write to iframe
	iframe.contentDocument.open();
	iframe.contentDocument.write(html);
	iframe.contentDocument.close();
}
