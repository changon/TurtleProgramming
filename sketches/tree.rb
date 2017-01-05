# http://leahbuechley.com/Turtle/examples/Tree/Tree.pde

def branch(iteration, branchLength, angle)
  if (iteration == 0) then
    return
  end

  t.forward(branchLength)
  t.left(angle)
  branch(iteration - 1, branchLength / 1.5, angle)
  t.right(angle)
  t.right(angle)
  branch(iteration - 1, branchLength / 1.5, angle)
  t.left(angle)
  t.back(branchLength)
end

# move turtle back 100 steps
t.penUp()
t.back(100)
t.penDown()
# draw tree
branch(6,100,30)
