/* Load Ace editor */
var _editor = ace.edit("editor");
// Options: https://github.com/ajaxorg/ace/wiki/Embedding-API
_editor.setOptions({
	// editor.renderer
	theme: "ace/theme/monokai",
});

// TODO
_editor.getSession().setOptions({
	// mode: "ace/mode/" + app.currentLanguage,
	mode: "ace/mode/javascript",
});

/* Window event listeners */
// Resize listener
window.addEventListener("resize", function() {
	_editor.resize();
	// TODO: resize p5 canvas as well
});

// MVC stuff?
var supportedLanguages = [
	{ name: 'JavaScript', value: 'javascript' },
	{ name: 'Ruby', value: 'ruby' },
	{ name: 'Python', value: 'python' },
];

var _languageSelect = new Vue({
	el: '#language-select',
	data: {
		supportedLanguages: supportedLanguages,
		currentLanguage: 'javascript'
	},
	methods: {
		onchange: function(e) {
			var lang = this.currentLanguage;
			console.log("Language changed to: " + lang);
			_editor.getSession().setOption("mode", "ace/mode/" + lang);
		}
	}
});

// TODO 
var app = new Vue({
	components: [ _languageSelect ]
});
