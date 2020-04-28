PROJECT_URL = "https://github.com/radiantnode/object-detector"
DATABASE_PATH = 'db/detections.db'
STREAM_URL = "http://mycamera.local:8080"
AWS_REGION = 'us-east-1'
S3_BUCKET = 'object-detections'
IMAGE_ENDPOINT = f"https://{S3_BUCKET}.s3.amazonaws.com"
SLEEP_TIME = 10
FILENAME_FORMAT = '{0:%Y/%m/%d/%H:%M:%S.jpg}'
DATE_FORMAT = '%A, %B %e %Y %I:%M:%S %p'
MOMENT_DATE_FORMAT = 'dddd, MMMM D YYYY hh:mm:ss A'
