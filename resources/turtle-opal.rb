require 'native'

$t = Native(`t`)
def t(); return $t; end

# Misc.
def logText(str); `logText(#{str})`; end
def prompt(str); `prompt(#{str})`; end
