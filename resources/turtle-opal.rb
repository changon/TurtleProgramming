require 'native'

def t(); Native(`t`); end
def logText(str); `logText(#{str})`; end
def prompt(str); `prompt(#{str})`; end
