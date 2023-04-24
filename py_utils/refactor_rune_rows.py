"""
Refactors rune rows json file to deduplicate similar rune-rows.
Local or temporal variations of base rune rows (such as elder or
younger futhark) are defined as deltas using "override_symbols"
and "inherit_from" fields.

Automatically detects which alphabet inherits from which by
trying to minimize the deltas.
"""
import sys
import json
import logging
from copy import deepcopy
import argparse


# Alphabets which can be inherited from.
BASE_ALPHABETS = [
  "older_futhark",
  "younger_futhark_long_branch",
  "younger_futhark_short_twig",
  "anglo_saxon",
  "medieval"
]


INPUT_FILE = "../src/RuneRows.json"


def set_up_logging():
  # https://stackoverflow.com/questions/14058453/making-python-loggers-output-all-messages-to-stdout-in-addition-to-log-file
  root = logging.getLogger()
  root.setLevel(logging.DEBUG)

  handler = logging.StreamHandler(sys.stdout)
  handler.setLevel(logging.DEBUG)
  formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
  handler.setFormatter(formatter)
  root.addHandler(handler)


def symbols_list_to_dict(symbols_list):
  result = {}
  for symbol in symbols_list:
    result[symbol['rune']] = symbol['latin']
  return result


def inherit(rune_row1, rune_row1_name, rune_row2):
  """
  Refactors rune_row2 to inherit from rune_row1.
  """
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

  return rune_row2


def inherit_from_smallest_delta(input_json, rune_row):
  """
  Finds the best candidate for the base alphabet for rune_row
  in input_json and refactors rune_row to inherit from it.
  """
  candidates = []
  for base in BASE_ALPHABETS:
    candidates.append(
      inherit(input_json[base], base, deepcopy(rune_row)))
  candidates.sort(key=lambda c: len(c['override_symbols']))
  for c in candidates:
    logging.debug(
      'Candidate: %s. Delta: %d' % (
        c['inherit_from'], len(c['override_symbols'])))
  return candidates[0]


def refactor_rune_rows(input_json):
  """
  Main function of the script.

  This function is (or at least should be) idempotent.
  """
  output_json = {}
  for base_alphabet_name in BASE_ALPHABETS:
    output_json[base_alphabet_name] = input_json[base_alphabet_name]
  for [name, alphabet] in input_json.items():
    if name in BASE_ALPHABETS:
      logging.debug("Skipping %s" % name)
      continue
    logging.debug("Refactoring %s" % name)
    output_json[name] = inherit_from_smallest_delta(
      input_json, alphabet)
    logging.info("%s now inherits from %s. Delta: %d" % (
      name, output_json[name]['inherit_from'],
      len(output_json[name]['override_symbols'])))
  return output_json


if __name__ == '__main__':
  parser = argparse.ArgumentParser(
                    prog='Refactor Rune Rows',
                    description='Refactors the rune rows json to be smaller.',
                    epilog='Have a nice day!')
  parser.add_argument(
    '-o', '--output', action='store', 
    help='Output file. If not provided, will print to stdout',
    required=False, type=str)
  args = parser.parse_args()

  set_up_logging()
  with open(INPUT_FILE, 'r') as fp:
    loaded_json = json.load(fp)
  output_json = refactor_rune_rows(loaded_json)

  if args.output:
    with open(args.output, 'w') as fp:
      json.dump(output_json, fp, indent=2)
  else:
    print(json.dumps(output_json, indent=2).encode().decode('unicode-escape'))