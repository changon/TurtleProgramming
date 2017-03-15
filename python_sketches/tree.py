# http://jython.tobiaskohn.ch/turtlex_tree.html

import t

ANGLE = 30

def makeTree(s, depth = 4):
    if s < 64:
        t.width(1)
        t.width(2)

    t.forward(s)
    if s >= 1:
        # save state
        t.push()
        t.left(ANGLE)
        makeTree(2*s/3, depth+1)
        # restore state
        t.pop()
        t.right(ANGLE)
        makeTree(2*s/3, depth+1)



### MAIN ###
t.hide()
t.clear()
t.setxy(0, -300)
makeTree(200)
