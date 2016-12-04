// *Introduction*
// Welcome to this programming tutorial!
// Today we're going to be exploring turtle graphics. Yay!
// Let's start with getting familiar with the sandbox.
// What you're reading now is called the *code editor*, and to the right
// is the *output window*.
// Code goes in the code editor, and when you execute it, it appears
// in the output window. Simple enough, eh?

// *Running some code*
// This sandbox is designed to be interactive, so that you don't have to wait
// for the program to start over before seeing changes.
// That means, you can execute code immediately after you write them, make changes,
// and repeat! Hopefully it should be very easy.
// To do this, select the code you want to run, and then press Ctrl+Enter
// (Cmd+Enter on Mac). If you don't select anything, it will run the current line only.
// Try it out! Place your cursor on the following line and press Ctrl+Enter.
// It should say "Hello, world!" in the bottom left corner of the output window.

logText("Hello, world!");

// Try selecting these two lines now and running them:
var name = prompt("What is your name?");
logText("Hello, " + name + "!");

// Did it work?
// Notice each line ends with a semicolon. You could get away with leaving those off at the end,
// but you should definitely get in the habit of including them.
// By the way, lines starting with // are called comments, which mean that it is not
// code and will not be run.
// You can use comments to write notes to yourself, and also "comment out" old code
// that you don't want to run.

// *Tortoise*
// Before we write any actual code, let's take a look at the the turtle in
// the middle of the output window. Well, it's not exactly a turtle, but we'll call it a turtle.
// (Maybe it's a tortoise because it taught us, though, but who knows?)
// The turtle can do four things: move forward, move backward, turn left, and turn right.
// It also has a pen that it draws lines with.
// We will be teaching the turtle how to draw stuff.

// Try playing with him! Click on the turtle, and use the WASD keys to tell him
// to move, and press R to clear and reset him to his original position.
// By default, he will only move 10 units and turn 10 degrees, but you can specify how many
// by typing in a number, and then pressing a key.
// For example, pressing 90d will tell the turtle to turn right 90 degrees.

// *Making some shapes*
// Remember, the turtle doesn't understand shapes, so you will have to teach him how to draw them.
// Let's start with a simple square. So he would first have to draw a straight line, turn 90 degrees,
// and do this three more times. Try teaching him to draw manually! You could type:
// 50w 90d 50w 90d 50w 90d 50w 90d
//
// Woah! That's a lot of numbers and letters!
// If we want to draw any more squares, we have to type that all again.We don't want to do that!
// Good thing there's another way! Let's write it out in code.

t.reset();
t.forward(50);
t.right(90);
t.forward(50);
t.right(90);
t.forward(50);
t.right(90);
t.forward(50);
t.right(90);

// That's a lot too, but now you can run it as many times as you wish!
// Notice how each command start with a t; this means that it is telling
// the turtle to do stuff. You can also put multiple commands on one line:

t.reset();
t.forward(50); t.right(90);
t.forward(50); t.right(90);
t.forward(50); t.right(90);
t.forward(50); t.right(90);

// Semicolons can be handy sometimes!

// Programming is all about making our lives simpler, so we don't
// need to write the same code over and over again.
// In other words, you should try to be DRY (don't repeat yourself) ;)

t.reset();
repeat(4, function () {
	t.forward(50);
	t.right(90);
});


// To be continued...









/***********************
 * Anything below this is isn't finished yet
 * Read on only if you're adventurous!
 * (We're not responsible for any damage to your cat if it
 * accidentally sets it on fire, not that it would though...)
 ***********************/
function star() {
	repeat(36, function() {
		t.forward(200);
		t.left(170);
	});
}

function polygon(n, s) {
	repeat(n, function() {
		t.forward(s);
		t.left(360);
	});
}

function demo() {
	// Uncomment to hide the turtle and draw faster
	// t.hide();
	//colour(0,0,255,1);
	for (var s = 100; s > 0; s -= 10) {
		square(s);
		t.right(36);
	}

	star(36);

	// Show the turtle again
	t.show();
}

function inputDemo() {
	var name = prompt("What is your name?");
	t.write("Hello, " + name + "!");

	var sides = parseInt(prompt("I will draw you a shape. How many sides do you want?"));
	polygon(sides, 50);
}

// Make turtle faster
t.scale = 1;

t.clear();
demo();
// inputDemo();
