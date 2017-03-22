require 'native'

t = Native(`t`)

# Misc.
def logText(str); `logText(#{str})`; end
def prompt(str); `prompt(#{str})`; end
