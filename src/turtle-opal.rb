require 'native'

$t = Native(`t`)
def t(); $t; end

# Misc.
def logText(str); `logText(#{str})`; end
def prompt(str); `prompt(#{str})`; end
