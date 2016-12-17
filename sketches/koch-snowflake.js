function koch(length, n) {
    // Base case
    if (n == 0) {
        t.forward(length);
    }
    // Recursive case
    else {
        length /= 3.0;
        koch(length, n-1);
        t.left(60);
        koch(length, n-1);
        t.right(120);
        koch(length, n-1);
        t.left(60);
        koch(length, n-1);
    }
}

function kochSnowflake(length, n) {
    // Orient and center snowflake
    t.setheading(0);
    t.setxy(-length/2, length/2*Math.sqrt(3));
    // Repeat 3 times
    repeat(3, function() {
        koch(length, n);
        t.right(120);
    })
}

t.scale = 1;
t.reset();
kochSnowflake(100, 3);
