import json

PREAMBLE = """
const StaticImages: {[id: string]: any} = {
"""

END = """
}

export default StaticImages;
"""

require_stmts = []

if __name__ == '__main__':
  with open('../src/Exercises.json', 'r') as fp:
    exercises = json.load(fp)
  for e in exercises:
    require_stmts += ["  '%s': require('./images/%s')," % (e['id'], e['img'])]
  print(PREAMBLE + '\n'.join(require_stmts) + END)