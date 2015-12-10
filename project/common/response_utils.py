from flask import make_response, jsonify, abort
from functools import wraps

from .exceptions import HttpError


def json_response(fun):
    """
    Decorator for a flask route returning json

    Returns:
        The returned dictionnary wrapped in make_response & jsonify
    """
    @wraps(fun)
    def wrapper(*args, **kwargs):
        try:
            return make_response(jsonify(fun(*args, **kwargs)))
        except HttpError as e:
            return make_response(jsonify({"error": e.message}), e.code)
    return wrapper
