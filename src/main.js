/* Load Ace editor */
var _editor = ace.edit("editor");
// Options: https://github.com/ajaxorg/ace/wiki/Embedding-API
_editor.setOptions({
	// editor.renderer
	theme: "ace/theme/monokai",
});

// TODO
_editor.getSession().setOptions({
	mode: "ace/mode/javascript",
});

var _languageSelect = document.getElementById("language-select");

_languageSelect.addEventListener("change", function() {
	_editor.getSession().setOption("mode", "ace/mode/" + _languageSelect.value);
});

/* Window event listeners */
// Resize listener
window.addEventListener("resize", function() {
	_editor.resize();
	// TODO: resize p5 canvas as well
});


