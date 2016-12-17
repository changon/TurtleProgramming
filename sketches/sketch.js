/***********************
 * Attention!
 * This is a work-in-progress. It is in no way finished yet!
 * Beware the many mistakes and errors! Report them if you can.
 * We're not responsible for any damage to your cat if it
 * accidentally sets it on fire, not that it would though...
 ***********************/

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
repeat(4, function() {
	t.forward(50);
	t.right(90);
});

// Pretty handy, huh? Now you can play around with the numbers without
// too much hassle.
// What if you change the angle? It wouldn't still be a square,
// but would it still make a polygon? Or would it be a star?
// Then, how many times do you have to repeat it to make the shape?

// This makes a star:
repeat(36, function() {
	t.forward(200);
	t.left(170);
});

/******************************/

// *Function and variables*
// In our last example, we used `repeat`.
// `repeat` expects an integer and a function, so we first provide
// it a number (5), and then a nameless function that tells the turtle
// to draw a straight line and turn right.

// In general, a function is a section of code that performs a certain task.
// Functions are useful because we can create code that we can reuse without
// repeating ourselves, and we can use functions inside other functions.
// All the turtle commands we've seen (t. plus something) are functions, and
// `repeat` itself is a function that repeats another function.

// Let's make our square example into its own function:
function square() {
	repeat(4, function() {
		t.forward(50);
		t.right(90);
	});
}

// Running this won't actually draw anything yet, since we haven't
// actually called it. Let's actually call it:
t.reset();
square();

// What if we don't want the same size square every time? We can add
// *parameters* to our function. These are the things that went
// (inside the parentheses) in our turtle commands, that told him
// how much to move or turn. In this case, our parameter will be the
// size of the square.

function square(size) {
	repeat(4, function() {
		t.forward(size);
		t.right(90);
	});
}

// Now we can make a design with squares of different sizes:
t.reset();
square(100); t.right(36)
square(90); t.right(36)
square(80); t.right(36)
square(70); t.right(36)
square(60); t.right(36)

// Again, we still keep repeating ourselves!
// We can use repeat, but we need something else, since the size
// of the square is changing every time.
// We can use a *variable* to store the size and change it
// every time it loops.

// To make a variable, you must declare it with `var` and assign it
// a value.
var foo = 10;
// After that, and you can use it anywhere
// that you can use its value.
logText(foo); // Should be 10

// You can reassign it a new value (you don't need `var` anymore)
foo = 100; logText(foo); // 100
foo = 12 * 4; logText(foo); // 48
foo = 93-59; logText(foo); // 34

// Don't read these as "foo equals ___", read it as "foo is assigned ___",
// since it's a little different from equals in math. You are actually giving the
// variable on the left side the value of what is on the right side, not comparing
// them.

// What do you think this does? Hint: find what the right hand side evaluates to.
foo = 100; // 100
foo = foo + 100; // ???

// `foo + 100` is equal to 100 + 100, which is 200. Then you are assigning foo
// the new value of 200. It may seem confusing and unnatural at first, but this
// is very useful if you want to keep adding onto or subtracting from a variable.

t.reset();
var s = 100;
repeat(10, function() {
	square(s); t.right(36);
	s = s - 10;
});

// Here, `s` is initially 100, and every time it repeats, 10 is
// subtracted from it, and we get smaller and smaller squares
// each time.

// What else can you do with functions and variables?

// This makes a polygon with n sides of length s
function polygon(n, s) {
	repeat(n, function() {
		t.forward(s);
		t.left(360 / n);
	});
}

t.clear();
polygon(3, 50); // Triangle
polygon(4, 50); // Square
polygon(5, 50); // Pentagon
polygon(6, 50); // Hexagon

// Questions to consider:
// Why is the number 360 significant?
// Does the turtle return to the same position and face the same
// direction every time it finishes?
// How would you make a circle?




/* Works cited */
// Examples taken from:
// Bernie Pope's Javascript Turtle demo (http://berniepope.id.au/html/js-turtle/turtle.html)
// ycatch's p5.turtle.js sandbox demo (https://ycatch.github.io/p5.turtle.js/example/instance_mode/index-is-sandbox.html)
