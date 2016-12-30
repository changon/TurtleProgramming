// https://www.youtube.com/watch?v=qNn6HQ7xn3M
// http://pastebin.com/BCF1xVBC

function  hex(side) {
    repeat(6, function() {
        t.forward(side)
        t.left(60)
    })
}
        

function rotation() {
    n = 0
    //colormode(255)
    //c = 0
    //pencolor(c,c,c)

    repeat(120, function() {
        //c += 255.0/120
        //pencolor(c,c,c)
        hex(n)
        n += 1
        t.left(3)
    })
}

t.reset()
t.hide()

t.penup()
t.goto(0,0)
t.pendown()

rotation()

t.show()