import os

from pymongo import MongoClient

mongo = MongoClient(os.environ.get("DB_PORT_27017_TCP_ADDR", "localhost")).test
