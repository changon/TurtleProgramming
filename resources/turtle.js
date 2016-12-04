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
	// Position and bearing
	this.x = 0;
	this.y = 0;
	this.x_new = this.x;
	this.y_new = this.y;
	this.ang = 90;
	this.ang_new = this.ang;

	// Appearance
	this.isVisible = true;

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
	this.vertices.push({type: "point", from: [this.x, this.y], to: [this.x_new, this.y_new]});
};

Turtle.prototype.addText = function(str) {
	this.vertices.push({type: "text", str: str});
};

// Turtle commands
Turtle.prototype.forward = function (n) { this.addCommand("forward", n); };
Turtle.prototype.right = function (n) { this.addCommand("right", n); };
Turtle.prototype.left = function (n) { this.addCommand("left", n); };
Turtle.prototype.goto = function([x, y]) { this.addCommand("goto", [x, y]); }
Turtle.prototype.show = function() { this.addCommand("show"); }
Turtle.prototype.hide = function() { this.addCommand("hide"); }
Turtle.prototype.clear = function() { this.addCommand("clear"); }
Turtle.prototype.write = function(str) { this.addCommand("write", str); }
// TODO: penup, pendown, stop, color

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
	background(64);

	// Make relative to origin
	push();
	translate(width/2, height/2);

	// Draw vertices
	// TODO: add support for different types
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
			text(vertex.str, 0, 0);
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
				console.log("Forward " + args);
				this.x_new = this.x + args * Math.cos(radians(this.ang));
				this.y_new = this.y + args * Math.sin(radians(this.ang));
				this.addVertex();
				break;
			case "right":
				console.log("Right " + args);
				this.ang_new = (this.ang - args);
				break;
			case "left":
				console.log("Left " + args);
				this.ang_new = (this.ang + args);
				break;
			case "goto":
				console.log("Goto " + args);
				this.x_new = args[0];
				this.y_new = args[1];
				break;
			case "hide":
				console.log("Hide");
				this.isVisible = false;
				break;
			case "show":
				console.log("Show");
				this.isVisible = true;
				break;
			case "clear":
				console.log("Clear");
				this.vertices = [];
				this.addVertex();
				break;
			case "write":
				console.log('Write "' + args + '"');
				this.addText(args);
				break;
		}
	}
}

Turtle.prototype.debug = function() {
	// TODO: print on screen,  debug mode
	console.log("Command finished: " + this.commandFinished); // debug
	console.log("x: " + t.x); // debug
	console.log("y: " + t.y); // debug
	console.log("ang: " + t.ang); // debug
	console.log("x_new: " + t.x_new); // debug
	console.log("y_new: " + t.y_new); // debug
	console.log("ang_new: " + t.ang_new); // debug
};

var t = new Turtle();
var canvas;

// var sketch = {};
// sketch.setup = function(p) {
function setup(p) {
	canvas = createCanvas(windowWidth, windowHeight);
	background(64);
	noFill();
	stroke(10,0,0,127);

	t.update();
	t.draw();
}

// sketch.draw = function(p) {
function draw(p) {
	t.update();

	// Redraw only if dirty
	if (!t.commandFinished) {
		t.draw();
	}
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
 */
var countPrefix = 0;
function keyPressed() {
	console.log(key)
	switch(key) {
		// Number keys
		case '0': case '1': case '2': case '3': case '4':
		case '5': case '6': case '7': case '8': case '9':
			console.log(countPrefix);
			countPrefix = countPrefix * 10 + parseInt(key);
			break;

		// WASD and hjkl bindings
		case 'W': case 'K': t.forward(countPrefix ? countPrefix : 10); countPrefix = 0; break;
		case 'A': case 'H': t.left(countPrefix ? countPrefix : 10); countPrefix = 0; break;
		case 'D': case 'L': t.right(countPrefix ? countPrefix : 10); countPrefix = 0; break;

		case ',': t.pendown(); break;
		case '.': t.penup(); break;
	}
}

/* Ideas
 * Turing tarpit like brainf?
 */
