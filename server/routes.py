import config
from dateutil import parser
from db.connection import cursor as c
from flask import Flask, render_template, request, jsonify
from detection.capture import Capture

app = Flask(__name__, static_folder="../public")
app.config["SEND_FILE_MAX_AGE_DEFAULT"] = 0


@app.route("/")
def index():
    c.execute("select * from object_detections order by id desc")
    results = c.fetchall()
    return render_template(
        "index.html", sorted=sorted, config=config, detections=results
    )


@app.route("/view/<id>")
def detect(id):
    c.execute("select * from object_detections where id = ?", [id])
    result = c.fetchone()

    return render_template("view.html", enumerate=enumerate, detection=result)


@app.route("/manual_capture", methods=["POST"])
def manual_capture():
    blob = request.data

    capture = Capture()
    capture.manual_capture = True
    capture.from_blob(blob)
    capture.upload()
    capture.rekognize()
    saved_id = capture.save()

    c.execute("select * from object_detections where id = ?", [saved_id])
    new_detection = c.fetchone()

    return jsonify(new_detection)


@app.template_filter("datetime")
def datetime_filter(value):
    return parser.parse(value).strftime(config.DATE_FORMAT)
