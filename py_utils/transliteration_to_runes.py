import sys
import json

if __name__ == '__main__':
  assert len(sys.argv) == 4
  _, transliteration, rune_rows_file, rune_row_name = sys.argv
  with open(rune_rows_file, 'r') as fp:
    rune_row_spec = json.load(fp)[rune_row_name]
  lat_to_rune = {}
  for symbol_spec in rune_row_spec['symbols']:
    lat_to_rune[symbol_spec['latin']] = symbol_spec['rune']

  result = []
  for ch in transliteration:
    result.append(lat_to_rune[ch])
  print(json.dumps(result))