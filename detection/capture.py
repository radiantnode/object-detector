import config
import requests
import boto3
import datetime
import json
from db.connection import connection, cursor as c

class Capture:
  def __init__(self):
    self.image = None
    self.filename = None
    self.label_data = None
    self.manual_capture = False
    self.now = datetime.datetime.now()

    s3 = boto3.resource('s3')
    self.s3_bucket = s3.Bucket(config.S3_BUCKET)
    self.rekognition = boto3.client('rekognition', region_name=config.AWS_REGION)

  def from_blob(self, blob):
    self.image = blob

  def upload(self):
    self.filename = config.FILENAME_FORMAT.format(self.now)
    self.s3_bucket.put_object(Key=self.filename, Body=self.image, ContentType='image/jpeg', ACL='public-read')

    return self.__image_url()

  def rekognize(self):
    results = self.rekognition.detect_labels(
      Image={
        "S3Object": {
          "Bucket": config.S3_BUCKET,
          "Name": self.filename
        }
      }
    )

    if results['Labels']:
      self.label_data = results['Labels']

    return self.label_data

  def save(self):
    c.execute(
      "insert into object_detections values (NULL, ?, ?, ?, JSON(?), JSON(?))",
      [
        self.now,
        self.manual_capture,
        self.__image_url(),
        json.dumps(self.__object_counts()),
        json.dumps(self.label_data)
      ]
    )

    connection.commit()

    return c.lastrowid

  def __image_url(self):
    return f"{config.IMAGE_ENDPOINT}/{self.filename}"

  def __object_counts(self):
    counts = {}
    for label in self.label_data:
      count = len(label['Instances'])
      if count > 0:
        counts[label['Name']] = count

    return counts
