# Expected input:
#   first line: runes, can be separated by whitespace
#   second line: corresponding latin characters
# Output:
#   json
import sys
import json

def remove_whitespace(line):
  return ''.join(map(lambda x: x.strip(), line))

rune_line, latin_line = tuple(map(remove_whitespace, sys.stdin.readlines()))

assert(len(rune_line) == len(latin_line))

output = []

for rune, lat in zip(rune_line, latin_line):
  output.append({
    'rune': rune,
    'latin': lat
  })

print(json.dumps(output, indent=2))
