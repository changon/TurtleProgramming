# B1A4 Good Timing album design thing

def triangle(size)
	t.right(30)
	3.times do
			t.forward(size)
			t.right(120)
	end
	t.left(30)
end

$x0 = -20/2 * 20
$s1 = 4.5 * 20
$s2 = 1 * 20

t.reset()

# First triangle
t.setxy($x0, 0)
triangle($s1)

# Second triangle
t.setxy($x0 + $s1, 0)
triangle($s1)

# Third triangle
t.setxy($x0 + $s1*2.5 - $s2/2, $s2*1.5)
triangle($s2)

# Fourth triangle
t.setxy($x0 + $s1*3, 0)
triangle($s1)

# The last four
t.setxy($x0 + $s1*4 + $s2*1.5, $s2*1.5 + $s2*0.8)
triangle($s2)

t.setxy($x0 + $s1*4 + $s2*1.5, $s2*1.5 - $s2*0.8)
triangle($s2)

t.setxy($x0 + $s1*4 + $s2*3.5, $s2*1.5 + $s2*0.8)
triangle($s2)

t.setxy($x0 + $s1*4 + $s2*3.5, $s2*1.5 - $s2*0.8)
triangle($s2)
