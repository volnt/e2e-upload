import os
import uuid

from flask import Blueprint, request, send_file

from ..common.response_utils import json_response
from ..common.exceptions import BadRequest, NotFound
from ..database import mongo

upload = Blueprint('upload', __name__)


@upload.route("/", methods=["POST"])
@json_response
def post_upload():
    upload_file = request.files.get('file')

    if not upload_file:
        raise BadRequest("UPLOAD_FILE_MANDATORY")

    file_path = os.path.join('/tmp/', upload_file.filename.rsplit('/')[0])
    upload_id = unicode(uuid.uuid4())

    upload_file.save(file_path)
    mongo.upload.insert_one({
        "_id": upload_id,
        "path": file_path
    })

    return {"_id": upload_id}


@upload.route("/<upload_id>", methods=["GET"])
def get_upload(upload_id):
    upload_file = mongo.upload.find_one({"_id": upload_id})

    if not upload_file or not upload_file.get("path"):
        raise NotFound("UPLOAD_NOT_FOUND")

    return send_file(upload_file["path"])
