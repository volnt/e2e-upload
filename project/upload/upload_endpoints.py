import uuid

from flask import Blueprint, request, send_file, current_app

from ..common.response_utils import json_response
from ..common.exceptions import BadRequest, NotFound
from ..database import mongo
from ..config import B2_CONFIG

from .backblaze import b2_authorize_account, b2_get_upload_url, b2_upload_file

upload = Blueprint("upload", __name__)


@upload.route("/", methods=["POST"])
@json_response
def post_upload():
    upload_file = request.files.get("file")

    if not upload_file:
        raise BadRequest("UPLOAD_FILE_MANDATORY")

    upload_id = unicode(uuid.uuid4())

    auth_resp = b2_authorize_account(
        B2_CONFIG["account_id"], B2_CONFIG["account_key"])

    current_app.logger.info("Auth response <%s>", auth_resp)

    url_resp = b2_get_upload_url(
        B2_CONFIG["bucket_id"], auth_resp["apiUrl"],
        auth_resp["authorizationToken"])

    current_app.logger.info("Url response <%s>", url_resp)

    upload_resp = b2_upload_file(
        upload_file, url_resp["uploadUrl"], url_resp["authorizationToken"])

    current_app.logger.info("Saved file %s", upload_resp)

    mongo.upload.insert_one({
        "_id": upload_id,
        "name": upload_file.filename,
        "type": upload_file.content_type,
        "path": upload_resp["fileId"]
    })

    return {"_id": upload_id}


@upload.route("/<upload_id>", methods=["GET"])
def get_upload(upload_id):
    upload_file = mongo.upload.find_one({"_id": upload_id})

    if not upload_file or not upload_file.get("path"):
        raise NotFound("UPLOAD_NOT_FOUND")

    return send_file(upload_file["path"], mimetype=upload_file.get("type"))
