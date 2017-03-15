'use strict';

/* Turtle wrapper for Skulpt */

// https://groups.google.com/forum/#!topic/skulpt/yNnJo-Eeb9w
// https://github.com/skulpt/skulpt/blob/93d0dc6f19ba2008716787f737f2003cf6ea5bb9/src/lib/math.js
// https://github.com/skulpt/skulpt/blob/master/src/lib/processing.js

Sk.builtinFiles.files['src/lib/t.js'] =
`var $builtinmodule = function(name) {
	var mod = {};

	// Import properties
	var props = Object.getOwnPropertyNames(t);
	for (let i in props) {
		if (typeof t[props[i]] === "number" ) {
			mod[props[i]] = new Sk.builtin.float_(t[props[i]]);
		}
	}

	// Import functions
	var funcs = Object.getOwnPropertyNames(t.__proto__);
	for (let i in funcs) {
		if (typeof t[funcs[i]] == "function") {
			mod[funcs[i]] = new Sk.builtin.func(function(...args) {
				args = args.map((x) => Sk.builtin.asnum$(x))
				return new Sk.builtin.float_(t[funcs[i]](...args));
			});
		}
	}

	return mod;
}`;
