###############
# Draw a binary tree by spawning clones
# Be careful, since 2^n clones are spawned on the nth iteration!
# This will slow down your computer a lot!

t.penup
t.back 300
t.pendown
t.hide

t.all.each do |a|
    ang = 45
    len = 20
    
    b = a.clone
    b.hide

    a.lt ang
    a.fd len
    b.rt ang
    b.fd len
    
    a.rt ang
    a.fd len
    b.lt ang
    b.fd len
end

t.killClones; t.reset

###############
# Draw a random binary tree by spawning clones
# Looks like the roots of a plant

t.all.each do |a|
    b = a.clone
    # b.hide
    a.lt rand(90)
    a.fd rand(50) + 10
    b.rt rand(90)
    b.fd rand(50) + 10
end

t.killClones; t.reset

###############
# Some kind of cool pattern

t.all.each do |a|
    b = a.clone
    b.rt 90
    a.fd 20
    b.fd 20
end

t.killClones; t.reset
