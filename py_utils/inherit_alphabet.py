import sys
import json
from collections import defaultdict

def symbols_list_to_dict(symbols_list):
  result = {}
  for symbol in symbols_list:
    result[symbol['rune']] = symbol['latin']
  return result

if __name__ == '__main__':
  assert len(sys.argv) == 4
  _, rune_rows_file, rune_row1_name, rune_row2_name = sys.argv
  with open(rune_rows_file, 'r') as fp:
    loaded_json = json.load(fp)
    rune_row1 = loaded_json[rune_row1_name]
    rune_row2 = loaded_json[rune_row2_name]
  
  # Set rune_row2['inherit_from']
  rune_row2['inherit_from'] = rune_row1_name
  
  # Move rune_row2['symbols'] into rune_row2['override_symbols']
  rune_row2['override_symbols'] = rune_row2['symbols']
  del rune_row2['symbols']

  # Clean up symbols which don't need overriding
  row1_mapping = symbols_list_to_dict(rune_row1['symbols'])
  for symbol in list(rune_row2['override_symbols']):
    rune, latin = symbol['rune'], symbol['latin']
    if rune in row1_mapping and row1_mapping[rune] == latin:
      rune_row2['override_symbols'].remove(symbol)
  print(rune_row2)
