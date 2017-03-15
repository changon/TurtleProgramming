'use strict';

// Reminiscent of Ruby's Number::times for coffeescript
// Usage:
// 5.times (i) -> console.log i
// 4.times -> t.fd 100; t.rt 90
// http://stackoverflow.com/a/8015103/5191980
Number.prototype.times = function(fn) {
	if (this.valueOf()) {
		for (var i = 0; i < this.valueOf(); i++) {
			fn(i);
		}
	}
};

// Similar to above, but more function
// Usage:
// repeat 5, (i) -> console.log i
// repeat 4, -> t.fd 100; t.rt 90
function repeat(n, fn) {
	for (var i = 0; i < n; i++) {
		fn(i);
	}
}

// Generates a random integer
// Uses p5js's `random` function
function randomInt(n) {
	return Math.floor(random(n));
}

// Prompts with a message and an optional default value
// If the result cannot be parsed as an integer,
// `null` is returned instead
function promptInt(message, default_) {
	var parsed = parseInt(prompt(message, default_));
	if (isNaN(parsed)) {
		return null;
	}
	return parsed;
}
