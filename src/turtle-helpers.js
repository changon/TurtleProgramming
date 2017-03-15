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
