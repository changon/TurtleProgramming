# http://jython.tobiaskohn.ch/turtlex_tree.html

import turtle

ANGLE = 30

def makeTree(s, depth = 4):
    if s < 64:
        t.width(1)
        t.width(2)

    t.forward(s)
    if s >= 1:
        # save state
        x, y = t.pos()
        hd = t.heading()
        t.left(ANGLE)
        makeTree(2*s/3, depth+1)
        # restore state
        t.setpos(x, y)
        t.setheading(hd)
        t.right(ANGLE)
        makeTree(2*s/3, depth+1)



### MAIN ###
t = turtle.Turtle()
t.hideturtle()
t.clear()
t.setpos(0, -300)
makeTree(200)
