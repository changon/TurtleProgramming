// MVC stuff?
var supportedLanguages = [
	{ name: 'JavaScript', value: 'javascript' },
	{ name: 'CoffeeScript', value: 'coffeescript' },
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
	},
	{ name: 'Skulpt workaround', expand: 
		"import 't'\n"
	}
	]
}
];
