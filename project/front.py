from flask import Blueprint, send_file

front = Blueprint("front", __name__)


@front.route("/")
def index():
    return send_file("index.html")
