"use strict";

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

	// Appearance
	this.isVisible = true;
	this.isPenDown = true;

	// Animation
	this.scale = 0.5; // scale for lerp, between 0.0 and 1.0

	// Backend
	this.commandQueue = []; // queue of commands
	this.commandFinished = true;
	this.vertices = []; // list of vertices
	this.addVertex();
};

Turtle.prototype.addCommand = function(cmd, args) {
	// Add command to end of queue (beginning of array)
	this.commandQueue.unshift([cmd, args]);
};

Turtle.prototype.addVertex = function() {
	if (this.isPenDown) {
		this.vertices.push({ type: "point", from: [this.x, this.y], to: [this.x_new, this.y_new] });
	}
};

Turtle.prototype.addText = function(str) {
	this.vertices.push({ type: "text", str: str, at: [this.x, this.y] });
};

/* Turtle commands */
// Move and draw
Turtle.prototype.forward = function (n) { this.addCommand("forward", n); };
Turtle.prototype.backward = function (n) { this.addCommand("backward", n); };
Turtle.prototype.right = function (n) { this.addCommand("right", n); };
Turtle.prototype.left = function (n) { this.addCommand("left", n); };
Turtle.prototype.setxy = function(x, y) { this.addCommand("setxy", [x, y]); }
Turtle.prototype.setheading = function(ang) { this.addCommand("setheading", ang); }
Turtle.prototype.write = function(str) { this.addCommand("write", str); }

// Drawing state
Turtle.prototype.show = function() { this.addCommand("show"); }
Turtle.prototype.hide = function() { this.addCommand("hide"); }
Turtle.prototype.clear = function() { this.addCommand("clear"); }
Turtle.prototype.pendown = function() { this.addCommand("pendown"); }
Turtle.prototype.penup = function() { this.addCommand("penup"); }

Turtle.prototype.reset = function() { this.clear(); this.setxy(0, 0); this.setheading(90); }

// Aliases
Turtle.prototype.goto = Turtle.prototype.setxy;

// TODO: stop, color
// TODO: push, pop context
// TODO: commandHistory, undo

Turtle.prototype.update = function() {
	// If turtle is visible, do all the fancy animation stuff
	if (this.isVisible) {
		// Check how close the values are to the new values
		var eps = 2; // epsilon value
		var x_eq = Math.abs(this.x - this.x_new) < eps;
		var y_eq = Math.abs(this.y - this.y_new) < eps;
		var ang_eq = Math.abs(this.ang - this.ang_new) < eps;

		if (x_eq && y_eq && ang_eq) {
			this.commandFinished = true;
			// Set them equal to the new values since they're close enough anyway
			this.x = this.x_new;
			this.y = this.y_new;
			this.ang = this.ang_new;
		} else {
			// Interpolate
			if (!x_eq) 		this.x = lerp(this.x, this.x_new, this.scale);
			if (!y_eq) 		this.y = lerp(this.y, this.y_new, this.scale);
			if (!ang_eq)	this.ang = lerp(this.ang, this.ang_new, this.scale);
		}

		if (this.commandFinished) {
			this.executeNextCommand();
		}
	}
	// Otherwise just do it the boring way
	else {
		while (this.commandQueue.length > 0) {
			this.executeNextCommand();
			this.x = this.x_new;
			this.y = this.y_new;
			this.ang = this.ang_new;
		}
	}
};

Turtle.prototype.draw = function() {
	// Clear canvas
	background(bgcolor);

	// Make relative to origin
	push();
	translate(width/2, height/2);

	// Draw vertices
	// TODO: rename this.vertices
	for (var i = 1; i < this.vertices.length; i++) {
		var vertex = this.vertices[i];
		if (vertex.type == "point") {
			var x1 = vertex.from[0];
			var y1 = vertex.from[1];
			var x2 = vertex.to[0];
			var y2 = vertex.to[1];
			line(x1, -y1, x2, -y2);
		}
		else if (vertex.type == "text") {
			push();
			fill(255);
			text(vertex.str, vertex.at[0], -vertex.at[1]);
			pop();
		}
	}

	// Now make relative to turtle
	push();
	translate(this.x, -this.y);
	rotate(-radians(this.ang));

	// Draw turtle
	if (this.isVisible) {
		// triangle(5, 0, -5, 4, -5, -4);
		quad(5, 0, -5, 4, -3, 0, -5, -4);
	}

	pop();
	pop();
};

Turtle.prototype.executeNextCommand = function() {
	// Get next command in command queue
	var command = this.commandQueue.pop();
	if (command) {
		this.commandFinished = false;
		var cmd = command[0];
		var args = command[1];
		switch (cmd) {
			case "forward":
				logText("Forward " + args);
				this.x_new = this.x + args * Math.cos(radians(this.ang));
				this.y_new = this.y + args * Math.sin(radians(this.ang));
				this.addVertex();
				break;
			case "backward":
				logText("Backward " + args);
				this.x_new = this.x - args * Math.cos(radians(this.ang));
				this.y_new = this.y - args * Math.sin(radians(this.ang));
				this.addVertex();
				break;
			case "right":
				logText("Right " + args);
				this.ang_new = (this.ang - args);
				break;
			case "left":
				logText("Left " + args);
				this.ang_new = (this.ang + args);
				break;
			case "setxy":
				logText("Set [x, y] to " + args);
				this.x_new = args[0];
				this.y_new = args[1];
				break;
			case "setheading":
				logText("Set heading to " + args);
				this.ang_new = args;
				break;
			case "hide":
				log("Hide");
				this.isVisible = false;
				break;
			case "show":
				logText("Show");
				this.isVisible = true;
				break;
			case "clear":
				logText("Clear");
				this.vertices = [];
				this.addVertex();
				break;
			case "write":
				logText('Write "' + args + '"');
				this.addText(args);
				break;
			case "pendown":
				logText("Pen down");
				this.isPenDown = true;
				break;
			case "penup":
				logText("Pen up");
				this.isPenDown = false;
				break;
		}
	}
}

Turtle.prototype.debug = function() {
	if (t.isDebug) {
		var s = "";
		s += "Position: " + [t.x, t.y] + "\n";
		s += "Heading: " + t.ang + "\n";
		s += "New position" + [t.x_new, t.y_new] + "\n";
		s += "New heading" + t.ang_new + "\n";

		text(s, 50, 50); // TODO change coords, fix multiline
	}
};

var t = new Turtle();
var canvas;
var bgcolor = 200; // 64
var message = "";

// var sketch = {};
// sketch.setup = function(p) {
function setup(p) {
	canvas = createCanvas(windowWidth, windowHeight);
	background(bgcolor);
	noFill();
	stroke(10,0,0,127);

	t.update();
	t.draw();
}

// sketch.draw = function(p) {
function draw(p) {
	// Redraw only if dirty
	if (!t.commandFinished) {
		t.draw();
		t.debug();

		// TODO change coords. change to div?
		push();
		fill(0);
		var m = message;
		if (isMacroRecording) { m = "Macro recording -- " + m; }
		text(m, 50, height - 50);
		pop();
	}

	t.update();
}

// Initialize instance mode
// new p5(sketch);

function repeat(n, f) {
	for (var i = 0; i < n; i++) {
		f();
	}
}

/* Interative etch-a-sketch mode
 * Specify count with number keys (0-9)
 * Move turtle with WASD or hjkl
 *
 * c: clear()
 * r: reset()
 * ,: pendown()
 * .: penup()
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
			logText("Count prefix: " + countPrefix);
			break;

		// Number keys
		case '0': case '1': case '2': case '3': case '4':
		case '5': case '6': case '7': case '8': case '9':
			countPrefix = countPrefix * 10 + parseInt(key);
			logText("Count prefix: " + countPrefix);
			break;

		// WASD and hjkl bindings
		case 'w': case 'k': t.forward(countPrefix ? countPrefix : 20); countPrefix = 0; break;
		case 's': case 'j': t.backward(countPrefix ? countPrefix : 20); countPrefix = 0; break;
		case 'd': case 'l': t.right(countPrefix ? countPrefix : 20); countPrefix = 0; break;
		case 'a': case 'h': t.left(countPrefix ? countPrefix : 20); countPrefix = 0; break;

		case 'c': t.clear(); break;
		case 'r': t.reset(); break;
		case ',': case '¼': t.pendown(); break; // Comma
		case '.': case '¾': t.penup(); break; // Period

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
			logText("Unknown command: " + key);
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
}

// TODO: make macros not based on keypress
function recordMacro() {
	logText(""); // trigger refresh
	isMacroRecording = true;
	macro_old = macro;
	macro = [];
}

function stopRecordingMacro() {
	logText("Macro recorded: " + macro.join(''));
	isMacroRecording = false;
}

function playMacro() {
	// Don't play the current macro when currently recording a macro
	if (!isMacroRecording) { // TODO
		logText("Playing macro: " + macro.join(''));
		for (var i in macro) {
			parseKey(macro[i]);
		}
	}
	// Play the old macro instead
	else {
		logText("Playing old macro: " + macro_old);
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
