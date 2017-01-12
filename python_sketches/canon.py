# http://jython.tobiaskohn.ch/turtlex_canon.html

# EXAMPLE FOR A CANON SHOOTER GAME USING THE TURTLE
#
# This is a simple canon shooter game. The objective is to
# position a canon so as to hit the target with a bullet.
# Use your mouse to control the canon's pitch, click to
# shoot.
#
# The target will be repositioned every time you hit it.
#
# Apr-18-2014
#
# (c) 2014, Tobias Kohn
# http://jython.tobiaskohn.ch/
#
from gturtle import *
from math import *
from time import sleep
from random import randint

BACKGROUND = makeColor("sky blue")
BULLETCOLOR = makeColor("yellow")
TARGETCOLOR = makeColor("red")

# Adapt to your turtle's playground size:
MAXX = 440
CANONPOS = -350
GROUNDLEVEL = -250

# Must be smaller than 40:
INITSPEED = 36

### Motion: Moving the bullet ###

# Position and speed of the bullet:
posX = 0
posY = 0
speedX = 0
speedY = 0

def fireBullet(initSpeedX, initSpeedY):
    """Fire the bullet. This function will not return as
       long as the bullet is flying."""
    global posX, posY, speedX, speedY
    posX = CANONPOS
    posY = GROUNDLEVEL + 15
    speedX = initSpeedX
    speedY = initSpeedY
    moveBullet()
    drawCanon()
    while posY > GROUNDLEVEL and posX < MAXX:
        moveBullet()
        if targetHit():
            msgDlg("You hit the target!\nCongratulations!")
            repositionTarget()
            break
        sleep(0.1)

def moveBullet():
    """Move the flying bullet. Recalculate the new position
       and speed according to gravity."""
    global posX, posY, speedX, speedY
    global canonDrawing
    # Wait for the canon to be drawed before drawing the 
    # bullet to avoid artefacts on the screen:
    while canonDrawing:
        sleep(0.001)
    # Erase the present bullet
    setPos(posX, posY)
    setPenColor(BACKGROUND)
    dot(12)
    # Update position and speed
    posX += speedX
    posY += speedY
    speedY -= 1.25
    # Draw the new bullet
    if posY > GROUNDLEVEL+6:
        setPos(posX, posY)
        setPenColor(BULLETCOLOR)
        dot(10)

### Target ###

targetX = 0
targetY = 0

def repositionTarget():
    """Reposition the target at a random position."""
    global targetX, targetY
    if targetX > 0:
        setPos(targetX, targetY)
        setPenColor(BACKGROUND)
        dot(60)
    targetX = -CANONPOS - randint(0, 50) -20
    targetY = randint(GROUNDLEVEL, -GROUNDLEVEL // 2 - 20)+20
    setPos(targetX, targetY)
    setPenColor(TARGETCOLOR)
    dot(40)
    setPenColor(makeColor("white"))
    dot(25)
    setPenColor(TARGETCOLOR)
    dot(10)

def targetHit():
    """Check if the bullet hit the target."""
    dist = sqrt((posX - targetX)**2 + (posY - targetY)**2)
    return (dist <= 25)

### Canon ###

canonAngle = 0
canonDrawing = False

def drawCanon():
    """Redraw the canon in the right angle.."""
    global canonAngle, canonDrawing
    canonDrawing = True
    setPos(CANONPOS+15, GROUNDLEVEL+30)
    setPenColor(BACKGROUND)
    dot(60)
    setPos(CANONPOS, GROUNDLEVEL+15)
    heading(canonAngle)
    penWidth(10)
    setPenColor(makeColor("#1A1A1A"))
    forward(20)
    setPos(CANONPOS, GROUNDLEVEL+15)
    setPenColor(makeColor("black"))
    dot(20)
    canonDrawing = False

### Mouse Handler ###

def onMouseClick(x, y):
    angle = radians(canonAngle)
    fireBullet(INITSPEED * sin(angle), INITSPEED * cos(angle))

def onMouseMove(x, y):
    global canonAngle
    deltaX = x - CANONPOS
    deltaY = y - GROUNDLEVEL
    if deltaX >= 0 and deltaY >= 0:
        canonAngle = degrees(atan2(deltaX, deltaY))
        drawCanon()

# Auxiliary Callback for the "mouseMoved"-event
def mouseMovedCallback(e):
    onMouseMove(toTurtleX(e.getX()), toTurtleY(e.getY()))

### MAIN ###
makeTurtle(mouseMoved = mouseMovedCallback,
           mouseHitX = onMouseClick)
# Draw the background
hideTurtle()
clear(BACKGROUND)
setPenColor(makeColor("dark green"))
penWidth(10)
setPos(-MAXX, GROUNDLEVEL-5)
moveTo(MAXX, GROUNDLEVEL-5)
setFillColor(makeColor("saddle brown"))
setPos(0, GROUNDLEVEL-10)
fill()
drawCanon()
repositionTarget()
