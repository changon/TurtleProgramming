"use strict";

// Get contentsof sketch.js without running
// function readFileFromURL(url)
var url = "sketch.js";
$.get(url, function(data) {
	editor.setValue(data);
}, "text");
// });
editor.clearSelection();

// $("body").keydown(function(event) {
document.body.addEventListener("keydown", function(event) {
	// https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/getModifierState
	window.event = event;
	var ctrlPressed = event.getModifierState("Control") || event.getModifierState("Meta");
	var key = event.key;

	if (ctrlPressed && key=="Enter") {
		console.log("HI");
		render();
	}
});

var iframe = document.querySelector("#output-iframe");

/* Helper functions */
function render() {
	var js_code = editor.getValue();

	// Probably should make sure there are no memory leaks or anything...
	// This probably will do for now though
	// Bug: memory leaks after 6 times?
	if (iframe.contentWindow.Gibber) {
		iframe.contentWindow.Gibber.clear();
	}

	// Inject some HTML into the iframe
	var html =
		'<!doctype html>\n' +
		'<html>\n' +
		'<head>\n\t\t' +
			'<meta charset="utf-8"/>\n\t' +
			'<title>Sandbox</title>\n' +
			'<link rel="stylesheet" href="./resources/iframe-style.css"/>\n' +
			'<script language="javascript" src="./resources/p5.min.js"></script>\n' +
			'<script src="./resources/p5.gibber.min.js" type="text/javascript" charset="utf-8"></script>\n' +
		'</head>\n' +
		'<body>\n' +
			'<script>' + js_code + '</script>\n' +
		'</body>\n' +
		'</html>';

	iframe.contentDocument.open();
	iframe.contentDocument.write(html);
	iframe.contentDocument.close();
}

// TODO: build iframe sandbox
	/* Libraries */
	// p5.js, p5.gibber.js
