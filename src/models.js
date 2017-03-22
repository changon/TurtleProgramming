'use strict';

// MVC stuff?
var defaultLanguage = 'coffee';

var supportedLanguages = {
	'javascript': 'JavaScript',
	'coffee': 'CoffeeScript',
	'ruby': 'Ruby',
	'python': 'Python',
};

// TODO: turn into snippets
var commandCatalog = [
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
	},
	{ name: 'Skulpt workaround', expand: 
		"import 't'\n"
	}
	]
}
];

var programList = [
	{ name: 'Guess a Number', fileName: 'guess-a-number', language: 'coffee' },
	{ name: 'Koch snowflake', fileName: 'koch-snowflake', language: 'ruby' },
	{ name: 'B1A4 Good Timing', fileName: 'b1a4-good-timing', language: 'ruby', autorun: true },
	{ name: 'Spiral', fileName: 'spiral', language: 'ruby' },
	{ name: 'Clones', fileName: 'clones', language: 'ruby' },
];
