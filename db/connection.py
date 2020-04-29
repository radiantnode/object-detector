import sqlite3
import json
import config

# Returns a dict for JSON column types. Not sure why I need to do this. :/
def dict_factory(cursor, row):
  d = {}
  for idx, col in enumerate(cursor.description):
    value = row[idx]
    if isinstance(value, str) and (value[:1] == "{" or value[:1] == "["):
      value = json.loads(value)
    d[col[0]] = value
  return d


connection = sqlite3.connect(config.DATABASE_PATH, check_same_thread=False)
connection.row_factory = dict_factory
cursor = connection.cursor()
