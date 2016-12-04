// Press Cmd + Enter to run

function square(side) {
	repeat(4, function () {
		t.forward(side);
		t.right(90);
	});
}

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
// demo();
inputDemo();
