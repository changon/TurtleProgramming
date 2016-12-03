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
	this.x = 0;
	this.y = 0;
	this.x_new = this.x;
	this.y_new = this.y;
	this.ang = 90;
	this.ang_new = this.ang;

	this.isVisible = true;

	this.scale = 0.1; // scale for lerp

	this.commands = []; // queue of commands
	this.commandFinished = true;

	this.vertices = [[0, 0]]; // list of vertices TODO tmp
};

Turtle.prototype.addCommand = function(cmd, args) {
	// Add command to end of queue (beginning of array)
	this.commands.unshift([cmd, args]);
};

Turtle.prototype.addVertex = function() {
	this.vertices.push([this.x_new, this.y_new]);
};

// Turtle commands
Turtle.prototype.forward = function (n) { this.addCommand("forward", n); };
Turtle.prototype.right = function (n) { this.addCommand("right", n); };
Turtle.prototype.left = function (n) { this.addCommand("left", n); };
Turtle.prototype.show = function() { this.addCommand("show"); }
Turtle.prototype.hide = function() { this.addCommand("hide"); }

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
		while (this.commands.length > 0) {
			this.executeNextCommand();
			this.x = this.x_new;
			this.y = this.y_new;
			this.ang = this.ang_new;
		}
	}
};

Turtle.prototype.executeNextCommand = function() {
	// Get next command in command queue
	var command = this.commands.pop();
	if (command) {
		this.commandFinished = false;
		var cmd = command[0];
		var args = command[1];
		switch (cmd) {
			case "forward":
				console.log("Forward " + args);
				this.x_new = this.x + args * Math.cos(radians(this.ang));
				this.y_new = this.y + args * Math.sin(radians(this.ang));
				break;
			case "right":
				console.log("Right " + args);
				this.ang_new = (this.ang - args);
				break;
			case "left":
				console.log("Left " + args);
				this.ang_new = (this.ang + args);
				break;
			case "hide":
				console.log("Hide");
				this.isVisible = false;
				break;
			case "show":
				console.log("Show");
				this.isVisible = true;
				break;
		}

		this.addVertex();
	}
}

Turtle.prototype.debug = function() {
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

}

// sketch.draw = function(p) {
function draw(p) {
	background(64);
	// Make relative to origin
	push(); // {
	translate(width/2, height/2);

	// Draw vertices
	for (var i = 1; i < t.vertices.length; i++) {
		var x1 = t.vertices[i-1][0];
		var y1 = t.vertices[i-1][1];
		var x2 = t.vertices[i  ][0];
		var y2 = t.vertices[i  ][1];
		line(x1, -y1, x2, -y2);
	}

	// Now make relative to turtle
	push(); // {
	translate(t.x, -t.y);
	rotate(-radians(t.ang));

	// Draw turtle
	if (t.isVisible) {
		triangle(5, 0, -5, 4, -5, -4);
	}

	pop(); // }
	pop(); // }

	t.update();
}

// new p5(sketch);

function repeat(n, f) {
	for (var i = 0; i < n; i++) {
		f();
	}
}
