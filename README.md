# Object Detector

## About

...

## Setup

_This documentation assumes you are setting this up on a Raspberry Pi and have already configured Raspbian. Adapt to your setup as needed._

### Requirements

* Raspberry Pi Zero W or 3 Model B+ or better and a [camera module](https://www.raspberrypi.org/products/camera-module-v2/).
* AWS credentials that have access to an [S3](https://aws.amazon.com/s3/) bucket and [Rekognition](https://aws.amazon.com/rekognition/) service.

### 1. Clone streameye

This is a forked version that adds CORS support to a simple [MJPEG server](https://github.com/radiantnode/streameye).

```
# cd ~
$ git clone git@github.com:radiantnode/streameye.git
```

### 2. Clone this project and `cd` in

```
$ git clone git@github.com:radiantnode/object-detector.git
$ cd object-detector
```

### 3. Install Python dependencies

```
pip3 install flask requests bota3
```

### 4. Setup database

Create the SQLite database.

```
$ sqlite3 db/detections.db < db/schema.sql
```

### 5. Configure

Copy the example configuration file and modify accordingly.

```
$ cp config.example.py config.py
```
