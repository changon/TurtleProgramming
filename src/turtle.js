'use strict';

/* class Turtle */
/*
 * Coordinates follow the Cartesian convention (right-hand rule?):
 * x: positive is right, negative is left
 * y: positive is up, negative is down
 * ang: positive is counterclockwise, negative is clockwise
 *
 * ang is in degrees, not radians
 */
var Turtle = function() {
	// Position and heading
	this.x = 0;
	this.y = 0;
	this.x_new = this.x;
	this.y_new = this.y;
	this.ang = 90;
	this.ang_new = this.ang;

	// Attributes
	this.color_ = 255; // white
	this.width_ = 1;

	// Appearance
	this.isVisible = true;
	this.isPenDown = true;

	// Animation
	this.scale = 10; // tweening speed

	// Backend
	this.stateStack = []; // stack of states
	this.commandQueue = []; // queue of commands
	this.commandFinished = true;
	this.vertices = []; // list of vertices

	// Cloning
	this.clones = []; // list of clones
	this.parent = null; // parent of clone
};

Turtle.prototype.addCommand = function(cmd, args) {
	// Add command to end of queue (beginning of array)
	this.commandQueue.unshift([cmd, args]);
};

Turtle.prototype.addCommand_ = function(cmd, args) {
	// If command is not finished, pop from the queue
	// and make it appear that it reached its destination
	if (!this.commandFinished) {
		this.commandQueue.pop();
		this.x_new = this.x;
		this.y_new = this.y;
		this.ang_new = this.ang;
		// this.commandFinished = true; // extraneous

		// Modify the last line drawn
		console.log("Before: " + this.vertices);
		var lastVertex = this.vertices.pop();
		if (lastVertex.type == 'point') {
			lastVertex.to = [ this.x, this.y ];
		}
		this.vertices.push(lastVertex);
		console.log("After: " + this.vertices);

	}

	// Add command to front of queue (end of array)
	this.commandQueue.push([cmd, args]);
};

Turtle.prototype.addVertex = function() {
	if (this.isPenDown) {
		this.vertices.push({
			type: 'point',
			from: [this.x, this.y],
			to: [this.x_new, this.y_new],
			color: this.color_,
			width: this.width_
		});
	}
};

Turtle.prototype.addText = function(str) {
	this.vertices.push({
		type: 'text',
		str: str, at: [this.x, this.y],
		color: this.color_
	});
};

// Add a placeholder to signify that there is a break between the previous vertex and the next vertex
// (i.e., when using penup, setxy, push, pop)
// This is so a line segment does not erroneously follow the turtle
// TODO: Although this could be a useful feature. Pick up and drop line?
Turtle.prototype.addVoid = function() {
	this.vertices.push({ type: 'void' });
};

// https://www.mathworks.com/help/symbolic/mupad_ref/plot-turtle.html
// Save the current state
Turtle.prototype.pushState = function() {
	this.stateStack.push({
		position: [this.x, this.y],
		angle: this.ang,
		color: this.color_,
		width: this.width_
	});
};

// Restore the last remembered state and remove it from the list of remembered states
Turtle.prototype.popState = function() {
	var lastState = this.stateStack.pop();
	if (lastState) {
		this.x_new = lastState.position[0];
		this.y_new = lastState.position[1];
		this.ang_new = lastState.angle;
		this.color_ = lastState.color;
		this.width_ = lastState.width;
		// console.log(this);
	}
	return lastState;
};

/* Cloning */
Turtle.prototype.clone = function() {
	logText('Clone');

	this.pushState();
	var state = this.popState();
	var newClone = new Turtle();
	newClone.parent = this;
	// TODO this is abusing push/pop so much...
	newClone.stateStack.push(state);
	newClone.popState();
	// TODO probably should refactor these curr = new assignments somewhere...
	newClone.x = newClone.x_new;
	newClone.y = newClone.y_new;
	newClone.ang = newClone.ang_new;

	// Add the clone to the list of clones
	this.clones.push(newClone);
	return newClone;
}

// Get a list containing itself, its clones, and their clones recursively
Turtle.prototype.all = function() {
	// Base case: no clones
	if (this.clones.length == 0) {
		return [ this ];
	}
	// Recursive case
	else {
		var flattened = [ this ];
		this.clones.forEach(function(clone, i) {
			flattened = flattened.concat(clone.all());
		});
		return flattened;
	}
}

// TODO: addCommand('mergeClones')
// Recursively merge clones' vertices, and kill the clones
Turtle.prototype.mergeClones = function() {
	var all = this.all();
	// TODO: add void vertex between the different clones
	var vertices = all.map((clone) => clone.vertices).reduce((a,b) => a.concat(b));
	this.vertices = vertices;
	this.killClones();
}

/* Turtle commands */
// Move and draw
Turtle.prototype.forward = function (n) { this.addCommand('forward', n); };
Turtle.prototype.backward = function (n) { this.addCommand('backward', n); };
Turtle.prototype.right = function (n) { this.addCommand('right', n); };
Turtle.prototype.left = function (n) { this.addCommand('left', n); };
Turtle.prototype.setxy = function(x, y) { this.addCommand('setxy', [x, y]); }
Turtle.prototype.setheading = function(ang) { this.addCommand('setheading', ang); }
Turtle.prototype.write = function(str) { this.addCommand('write', str); }

Turtle.prototype.push = function () { this.addCommand('push'); };
Turtle.prototype.pop = function () { this.addCommand('pop'); };

// Drawing state
Turtle.prototype.show = function() { this.addCommand('show'); }
Turtle.prototype.hide = function() { this.addCommand('hide'); }
Turtle.prototype.clear = function() { this.addCommand('clear'); }
Turtle.prototype.pendown = function() { this.addCommand('pendown'); }
Turtle.prototype.penup = function() { this.addCommand('penup'); }
Turtle.prototype.color = function(...args) { this.addCommand('color', args); }
Turtle.prototype.width = function(n) { this.addCommand('width', n); }

Turtle.prototype.reset = function() { this.addCommand('reset'); }

// Cloning
Turtle.prototype.killClones = function() { this.addCommand('killClones'); }

// Urgent commands
Turtle.prototype['show!'] = function() { this.addCommand_('show'); }
Turtle.prototype['hide!'] = function() { this.addCommand_('hide'); }
Turtle.prototype['clear!'] = function() { this.addCommand_('clear'); }
Turtle.prototype['pendown!'] = function() { this.addCommand_('pendown'); }
Turtle.prototype['penup!'] = function() { this.addCommand_('penup'); }
Turtle.prototype['reset!'] = function() { this.addCommand_('reset'); }
Turtle.prototype['setxy!'] = function(x, y) { this.addCommand_('setxy', [x, y]); }
Turtle.prototype['setheading!'] = function(x, y) { this.addCommand_('setheading', [x, y]); }

Turtle.prototype['stop!'] = function() { this.addCommand_('stop'); }
Turtle.prototype['killClones!'] = function() { this.addCommand_('killClones'); }

// Aliases
Turtle.prototype.fd = Turtle.prototype.forward;
Turtle.prototype.bk = Turtle.prototype.back = Turtle.prototype.backward;
Turtle.prototype.rt = Turtle.prototype.right;
Turtle.prototype.lt = Turtle.prototype.left;
Turtle.prototype.goto = Turtle.prototype.setxy;
Turtle.prototype.seth = Turtle.prototype.setheading;
Turtle.prototype.up = Turtle.prototype.penup;
Turtle.prototype.down = Turtle.prototype.pendown;

Turtle.prototype['goto!'] = Turtle.prototype['setxy!'];
Turtle.prototype['seth!'] = Turtle.prototype['setheading!'];

// isX -> x?
Object.defineProperty(Turtle.prototype, 'pendown?', { get: function() { return this.isPenDown; }, })
Object.defineProperty(Turtle.prototype, 'visible?', { get: function() { return this.isVisible; }, })

// TODO: stop, color
// TODO: commandHistory, undo

Turtle.prototype.update = function() {
	// If turtle is visible, do all the fancy animation stuff
	if (this.isVisible) {
		// Check if turtle has reached its new position (or close enough to it)
		var x_eq = this.x_new == this.x;
		var y_eq = this.y_new == this.y;
		var ang_eq = Math.abs(this.ang_new - this.ang) < 1;

		// If it has, then execute the next command
		if (x_eq && y_eq && ang_eq) {
			this.ang = this.ang_new;

			this.commandFinished = true;
			this.executeNextCommand();
		}
		// Otherwise move towards new position
		else {
			var diff = new p5.Vector(this.x_new - this.x, this.y_new - this.y);
			var dist = diff.mag();
			var dir = diff.normalize(); // destructive

			// Set them equal to the new values if closer than scale
			if (dist < this.scale) this.x = this.x_new; else this.x += this.scale * dir.x;
			if (dist < this.scale) this.y = this.y_new; else this.y += this.scale * dir.y;

			this.ang = lerp(this.ang, this.ang_new, 0.5);
		}

	}
	// Otherwise just do it the boring way
	else {
		// var n = this.commandQueue.length * this.scale; // while (n--)
		while (this.commandQueue.length > 0) {
			this.executeNextCommand();
			this.x = this.x_new;
			this.y = this.y_new;
			this.ang = this.ang_new;
		}
	}

	// Update clones
	this.clones.forEach(function(clone, i) {
		clone.update();
	})
};

Turtle.prototype.draw = function() {
	// Make relative to origin
	push(); // {
	translate(width/2, height/2);

	// TODO perspective?

	// Draw vertices
	// TODO: rename this.vertices
	for (var i = 0; i < this.vertices.length; i++) {
		push(); // {
		var vertex = this.vertices[i];
		if (vertex.type == 'point') {
			stroke(vertex.color);
			strokeWeight(vertex.width);

			var [x1, y1] = vertex.from;
			var x2, y2;

			// Draw only up to the turtle, don't draw ahead
			if (i == this.vertices.length-1 && !this.commandFinished) {
				[x2, y2] = [this.x, this.y];
			} else {
				[x2, y2] = vertex.to;
			}

			line(x1, -y1, x2, -y2);
		}
		else if (vertex.type == 'text') {
			noStroke();
			fill(vertex.color);
			text(vertex.str, vertex.at[0], -vertex.at[1]);
		}
		// ignore void

		pop(); // }
	}

	// Now make relative to turtle
	push(); // {
	translate(this.x, -this.y);
	rotate(-radians(this.ang));

	// Draw turtle
	if (this.isVisible) {
		// stroke(0, 0, 0, 127);
		stroke(this.color_, this.color_, this.color_, 127);
		// noFill();
		fill(this.color_);
		// triangle(5, 0, -5, 4, -5, -4);
		quad(5, 0, -5, 4, -3, 0, -5, -4);
		noFill();
	}

	pop(); // }

	pop(); // }

	// Draw clones
	this.clones.forEach(function(clone, i) {
		clone.draw();
	})
};

Turtle.prototype.executeNextCommand = function() {
	// Get next command in command queue
	var command = this.commandQueue.pop();
	if (command) {
		this.commandFinished = false;
		var cmd = command[0];
		var args = command[1];
		switch (cmd) {
			case 'forward':
				logText('Forward ' + args);
				this.x_new = this.x + args * Math.cos(radians(this.ang));
				this.y_new = this.y + args * Math.sin(radians(this.ang));
				this.addVertex();
				break;
			case 'backward':
				logText('Backward ' + args);
				this.x_new = this.x - args * Math.cos(radians(this.ang));
				this.y_new = this.y - args * Math.sin(radians(this.ang));
				this.addVertex();
				break;
			case 'right':
				logText('Right ' + args);
				this.ang_new = (this.ang - args);
				break;
			case 'left':
				logText('Left ' + args);
				this.ang_new = (this.ang + args);
				break;
			case 'setxy':
				logText('Set [x, y] to ' + args);
				this.x_new = args[0];
				this.y_new = args[1];
				this.addVoid();
				break;
			case 'setheading':
				logText('Set heading to ' + args);
				this.ang_new = args;
				break;
			case 'hide':
				logText('Hide');
				this.isVisible = false;
				break;
			case 'show':
				logText('Show');
				this.isVisible = true;
				break;
			case 'clear':
				logText('Clear');
				this.vertices.length = 0;
				break;
			case 'write':
				logText('Write "' + args + '"');
				this.addText(args);
				break;
			case 'push':
				logText('Saving state');
				this.pushState();
				this.addVoid();
				break;
			case 'pop':
				logText('Restoring state');
				this.popState();
				this.addVoid();
				break;
			case 'pendown':
				logText('Pen down');
				this.isPenDown = true;
				break;
			case 'penup':
				logText('Pen up');
				this.isPenDown = false;
				this.addVoid();
				break;
			case 'color':
				logText('Set color to ' + args);
				this.color_ = color(...args); // wrap using p5.Color
				break;
			case 'width':
				logText('Set width to ' + args);
				this.width_ = args;
				break;
			case 'reset':
				logText('Reset');

				// clear(); setxy(0, 0); setheading(90);
				this.vertices.length = 0;
				this.ang = this.ang_new = 90;
				this.x = this.y = 0;
				this.x_new = this.y_new = 0;
				break;
			case 'stop':
				logText('Stop');

				// Reset command queue
				// Why doesn't this work? this.commandQueue.length = 0;
				while (this.commandQueue.length > 0) { this.commandQueue.pop(); }
				break;

			case 'killClones':
				logText('Kill clones');
				// Kill clones
				// As a side effect, all clones of the clones are killed as well
				while (this.clones.length > 0) { this.clones.pop(); }
				break;
		}
	}
}

Turtle.prototype.debug = function() {
	if (this.isDebug) {
		var s = '';
		s += 'Position: ' + [this.x, this.y] + '\n';
		s += 'Heading: ' + this.ang + '\n';
		s += 'New position' + [this.x_new, this.y_new] + '\n';
		s += 'New heading' + this.ang_new + '\n';

		text(s, 50, 50); // TODO change coords, fix multiline
	}
};

/******************************************************************************/

// This is the mother of all turtles (MOAT)
var t = new Turtle();
var canvas;
var bgcolor = 0; // 200, 64
var message = '';

// Proxy for all clones
var cloneProxy = new Proxy({}, {
	get: (target, key) => {
		// Output a function
		return (...args) => {
			var all = t.all();
			// Proxy the function call to each clone
			return all.map((clone) => {
				var prop = clone[key];
				if (typeof prop === 'function') {
					clone[key](...args);
				}
			});
		};
	}
	// set?
});

// Set the proxy: either just the MOAT, or all clones
// TODO use a viewmodel for this
var proxy = cloneProxy;
// var proxy = t;

// var sketch = {};
// sketch.setup = function(p) {
function setup(p) {
	canvas = createCanvas(windowWidth, windowHeight);
	background(bgcolor);
	textFont('Helvetica');
	strokeCap(PROJECT);

	t.update();
	t.draw();
}

// sketch.draw = function(p) {
function draw(p) {
	// Redraw only if dirty
	if (!t.commandFinished) {
		// Clear canvas
		background(bgcolor);

		t.draw();
		t.debug();

		// TODO change coords. change to div?
		push(); // {
		stroke(255);
		fill(255);
		strokeWeight(0);
		var m = message;
		if (isMacroRecording) { m = 'Macro recording -- ' + m; }
		text(m, 50, height - 50);
		pop(); // }
	}

	t.update();
}

// Initialize instance mode
// new p5(sketch);

/* Interative etch-a-sketch mode
 * Specify count with number keys (0-9)
 * Move turtle with WASD or hjkl
 *
 * c: clear()
 * r: reset()
 * ,: pendown()
 * .: penup()
 * \: show()/hide()
 */
var countPrefix = 0;
var macro = [];
var macro_old = [];
var isMacroRecording = false;

function parseKey(key) {
	var addToMacro = true;

	switch(key) {
		// Special keys
		case BACKSPACE:
			countPrefix = 0;
			logText('Count prefix: ' + countPrefix);
			break;

		// Number keys
		case '0': case '1': case '2': case '3': case '4':
		case '5': case '6': case '7': case '8': case '9':
			countPrefix = countPrefix * 10 + parseInt(key);
			logText('Count prefix: ' + countPrefix);
			break;

		// WASD and hjkl bindings
		case 'w': case 'k': proxy.forward(countPrefix ? countPrefix : 20); countPrefix = 0; break;
		case 's': case 'j': proxy.backward(countPrefix ? countPrefix : 20); countPrefix = 0; break;
		case 'd': case 'l': proxy.right(countPrefix ? countPrefix : 20); countPrefix = 0; break;
		case 'a': case 'h': proxy.left(countPrefix ? countPrefix : 20); countPrefix = 0; break;

		case 'c': proxy['clear!'](); break;
		case 'r': proxy['stop!'](); proxy['reset!'](); proxy['killClones!'](); break;
		case ',': case '¼': proxy['pendown!'](); break; // Comma
		case '.': case '¾': proxy['penup!'](); break; // Period
		case '\\': proxy.isVisible ? proxy['hide!']() : proxy['show!'](); break;

		// Macro
		case 'q':
			// Record if stopped, Stop if recording
			if (isMacroRecording) { stopRecordingMacro(); }
			else { recordMacro(); }
			addToMacro = false;
			break;

		case '@':
			repeat(countPrefix ? countPrefix : 1, function() { playMacro(); });
			addToMacro = false;
			break;

		default:
			logText('Unknown command: ' + key);
			addToMacro = false;
	}

	// Record macro, not recording the 'q' or '@' keys or unknown keys
	if (addToMacro) {
		macro.push(key);
	}
}

function keyPressed() {
	// Only parse backspace
	if (keyCode == BACKSPACE) {
		parseKey(keyCode);
	}
}

function keyTyped() {
	parseKey(key);
	console.log('pressed'); // TODO tmp
}

// TODO: make macros not based on keypress
function recordMacro() {
	logText(''); // trigger refresh
	isMacroRecording = true;
	macro_old = macro;
	macro = [];
}

function stopRecordingMacro() {
	logText('Macro recorded: ' + macro.join(''));
	isMacroRecording = false;
}

function playMacro() {
	// Don't play the current macro when currently recording a macro
	if (!isMacroRecording) { // TODO
		logText('Playing macro: ' + macro.join(''));
		for (var i in macro) {
			parseKey(macro[i]);
		}
	}
	// Play the old macro instead
	else {
		logText('Playing old macro: ' + macro_old);
		for (var i in macro_old) {
			parseKey(macro_old[i]);
		}
	}
}

// Log text to console and canvas
function logText(str) {
	t.commandFinished = false; // Set dirty flag and trigger refresh
	console.log(str);
	message = str;
}

/* Ideas
 * Turing tarpit like brainf?
 */
