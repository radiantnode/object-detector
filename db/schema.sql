CREATE TABLE object_detections (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  datetime VARCHAR(255),
  manual_capture TINYINT(1) DEFAULT 0,
  photo_url VARCHAR(255),
  counts JSON,
  labels JSON
)
