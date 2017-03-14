- [x] Some kind of MVC system: Using Vue for now
  - React
  - Backbone
  - Angular

- [ ] Manage dependencies:
  - Webpack?
  - Bower?

- [ ] Database:
  - MongoDB
  - This probably means the app will no longer be standalone,
    and has to be a node app

- Turtle graphics:
  - [ ] Convert to D3/SVG for faster drawing times?
    - Canvas and processing is too slow, since it draws sequentially
  - [ ] Display cursor position relative to turtle

- [ ] Ace editor:
  - [ ] Autocomplete and syntax checking for Ruby and Python (JS syntax checking is built in)
  - [ ] Menu for commands
    - Turtle commands: t.left, t.right, t.forward, t.backward
	- Control: if, else, end, while
  - [ ] Drag to edit numbers

- [ ] Toolbar
  - [ ] Fix button onclick handlers
  - [ ] Bind to t.scale
  - [ ] Bind to commandQueue.length
  - [ ] Select clones, display how many there are

- Accessibility:
  - ARIA labels for buttons, editor, output, etc
