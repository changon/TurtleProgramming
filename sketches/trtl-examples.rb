# Taken from peterc/trtl examples
# https://github.com/peterc/trtl/tree/master/examples

## example 4
def tree(_size)
   if _size < 10
      t.fd _size; t.bk _size; return
   end
   t.color 'brown'
   t.fd _size / 3
   t.color %w{green darkgreen darkolivegreen}.sample
   t.left 30; tree _size * 2 / 3; t.right 30
   t.forward _size / 6
   t.right 25; tree _size / 2; t.left 25
   t.forward _size / 3
   t.width rand(2) + 1
   t.right 25; tree _size / 2; t.left 25
   t.forward _size / 6
   t.bk _size
   # ensure_drawn
end

t.left 90
t.bk 180
t.pendown
tree 300.0

### example 3
DEG = Math::PI / 180.0

def byzantium(r, n)
   return if n < 1
   t.fd r; t.rt 135
   4.times {
      t.pendown; t.fd 2 * r * Math::sin(45 * DEG); t.penup
      byzantium(r / 2, n - 1)
      t.rt 90
   }
   t.lt 135; t.bk r
end

byzantium(100, 4)
