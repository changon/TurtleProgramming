require 'native'

$t = Native(`t`)
def t(); return $t; end

# TODO: metaprogramming attach these methods into an arbitrary Turtle

# Underscore -> bang
# def $t.show!; `t.show_()`; end
def $t.show!; `t.show_()`; end
def $t.hide!; `t.hide_()`; end

# isX -> x?
def $t.pendown?(); return `t.isPenDown`; end
def $t.visible?(); return `t.isVisible`; end

# Misc.
def logText(str); `logText(#{str})`; end
def prompt(str); `prompt(#{str})`; end
