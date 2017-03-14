# https://www.youtube.com/watch?v=qNn6HQ7xn3M
# http://pastebin.com/BCF1xVBC

def hex(side)
    6.times do
        t.forward(side)
        t.left(60)
    end
end


def rotation()
    n = 0
    #colormode(255)
    c = 0
    #pencolor(c,c,c)

    120.times do
        c += 255.0/120
        # pencolor(c,c,c)
        hex(n)
        n += 1
        t.left(3)
	end
end

t.reset()
t.hide()

t.penup()
t.goto(0,0)
t.pendown()

rotation()

t.show()
