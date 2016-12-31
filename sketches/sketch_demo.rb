# Press Cmd + Enter to run

def square(side)
	4.times do
		t.forward(side)
		t.right(90)
	end
end

def star()
	36.times do
		t.forward(200)
		t.left(170)
	end
end

def polygon(n, s)
	n.times do
		t.forward(s)
		t.left(360)
	end
end

def demo()
	# Uncomment to hide the turtle and draw faster
	# t.hide()
	# colour(0,0,255,1)
	100.step(0, -10) do |s|
		square(s)
		t.right(36)
	end

	star(36)

	# Show the turtle again
	t.show()
end

def inputDemo()
	name = prompt("What is your name?")
	t.write("Hello, " + name + "!")

	sides = parseInt(prompt("I will draw you a shape. How many sides do you want?"))
	polygon(sides, 50)
end

# Make turtle faster
t.scale = 1

t.clear()
demo()
# inputDemo()
