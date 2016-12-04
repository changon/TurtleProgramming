// Press Cmd + Enter to run

// Inspired by: http://berniepope.id.au/html/js-turtle/turtle.html

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

t.scale = 1
t.clear();
demo()
