import json


def generate_static_images():
  PREAMBLE = """
const StaticImages: {[id: string]: any} = {
"""

  END = """
}

  """

  require_stmts = []

  with open('../src/Exercises.json', 'r') as fp:
    exercises = json.load(fp)
  for e in exercises:
    require_stmts += ["  '%s': require('./images/%s')," % (e['id'], e['img'])]
  print(PREAMBLE + '\n'.join(require_stmts) + END)


def generate_static_thumbnails():
  PREAMBLE = """
const StaticThumbnails: {[id: string]: any} = {
"""

  END = """
}

export {StaticImages, StaticThumbnails};
  """

  require_stmts = []

  with open('../src/Exercises.json', 'r') as fp:
    exercises = json.load(fp)
  for e in exercises:
    require_stmts += ["  '%s': require('./images/thumbnails/%s')," % (e['id'], e['img'])]
  print(PREAMBLE + '\n'.join(require_stmts) + END)


if __name__ == '__main__':
  generate_static_images()
  generate_static_thumbnails()