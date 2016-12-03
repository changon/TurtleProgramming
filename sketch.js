// Press Cmd + Enter to run

// Inspired by: http://berniepope.id.au/html/js-turtle/turtle.html

function square(side) {
   repeat(4, function () {
      t.forward(side);
      t.right(90);
   });
}

function demo() {
   t.hide();
   //colour(0,0,255,1);
   for(s = 100; s > 0; s -= 10) {
      square(s);
      t.right(36);
   }
}

demo()
