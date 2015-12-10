from flask import Flask

from upload.upload_endpoints import upload
from front import front

app = Flask(__name__)
app.secret_key = "So secret !"

app.register_blueprint(front, url_prefix='/')
app.register_blueprint(upload, url_prefix='/upload')

print app.url_map
