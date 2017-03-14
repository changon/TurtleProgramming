/* Load Ace editor */
var _editor = ace.edit('editor');
// Options: https://github.com/ajaxorg/ace/wiki/Embedding-API
_editor.setOptions({
	// editor.renderer
	theme: 'ace/theme/monokai',
});

// TODO
_editor.getSession().setOptions({
	// mode: 'ace/mode/' + app.currentLanguage,
	mode: 'ace/mode/ruby',
});

/* Window event listeners */
// Resize listener
window.addEventListener('resize', function() {
	_editor.resize();
	// TODO: resize p5 canvas as well
});

// MVC stuff?
var supportedLanguages = [
	{ name: 'JavaScript', value: 'javascript' },
	{ name: 'Ruby', value: 'ruby' },
	{ name: 'Python', value: 'python' },
];

// TODO: turn into snippets
var programCatalog = [
{
	category: 'Turtle',
	commands: [
	{ name: 't.forward()', expand: 't.forward($0)\n' },
	{ name: 't.backward()', expand: 't.backward($0)\n' },
	{ name: 't.right()', expand: 't.right($0)\n' },
	{ name: 't.left()', expand: 't.left($0)\n' },
	{ name: 't.clear()', expand: 't.clear()\n' },
	{ name: 't.reset()', expand: 't.reset()\n' },
	{ name: 't.pendown()', expand: 't.pendown()\n' },
	{ name: 't.penup()', expand: 't.penup()\n' },
	{ name: 't.show()', expand: 't.show()\n' },
	{ name: 't.hide()', expand: 't.hide()\n' }
	// t.stop!
	]
},
{
	category: 'Control flow',
	commands: [
	{ name: 'if ... end', expand: 'if $1\n\t$0\nend\n' },
	{ name: 'while ... end', expand: 'while $1\n\t$0\nend\n' }
	]
},
{
	category: 'Define',
	commands: [
	{ name: 'def ... end', expand: 'def $1\n\t$0\nend\n' },
	{ name: 'class ... end', expand: 'class $1\n\t$0\nend\n' }
	]
},
{
	category: 'Misc',
	commands: [
	{ name: 'Opal workaround', expand: 
		"require 'native'\n" +
		"$t = Native(`t`)\n" +
		"def t(); $t; end\n"
	}
	]
}
];

var _toolbar = new Vue({
	el: '#toolbar',
	data: {
		supportedLanguages: supportedLanguages,
		currentLanguage: 'ruby',
		programCatalog: programCatalog
	},
	methods: {
		updateLanguage: function() {
			var lang = this.currentLanguage;
			console.log('Language changed to: ' + lang);
			_editor.getSession().setOption('mode', 'ace/mode/' + lang);
		},
		insertCode: function(code) {
			// Since we don't have snippets implemented yet,
			// just strip out the dollar signs
			var sanitized = code.split(/\$[0-9]/).join('');
			_editor.insert(sanitized);
		}
	}
});

// TODO 
var app = _toolbar;
